import { beforeEach, expect, it, vi } from "vitest";

const { platform, saved, storage } = vi.hoisted(() => {
  const saved = new Map<string, string>();
  return {
    platform: { OS: "ios" },
    saved,
    storage: {
      getItem: vi.fn((key: string) => Promise.resolve(saved.get(key) ?? null)),
      removeItem: vi.fn((key: string) => {
        saved.delete(key);
        return Promise.resolve();
      }),
      setItem: vi.fn((key: string, value: string) => {
        saved.set(key, value);
        return Promise.resolve();
      }),
    },
  };
});

vi.mock("@react-native-async-storage/async-storage", () => ({
  default: storage,
}));
vi.mock("react-native", () => ({ Platform: platform }));

beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
  saved.clear();
  platform.OS = "ios";
});

async function loadStore() {
  const module = await import("./use-user-settings-store");
  await vi.waitFor(() => {
    expect(module.useUserSettingsStore.getState().hasHydrated).toBe(true);
  });
  return module;
}

it("starts with Spotify selected and hydrates automatically", async () => {
  const { useUserSettingsStore } = await loadStore();
  expect(useUserSettingsStore.getState().streamingService).toBe("spotify");
});

it("offers exactly the five supported streaming services", async () => {
  const { STREAMING_SERVICES } = await loadStore();
  expect(
    Object.entries(STREAMING_SERVICES).map(([value, label]) => ({
      label,
      value,
    })),
  ).toEqual([
    { label: "Amazon Music", value: "amazon_music" },
    { label: "Apple Music", value: "apple_music" },
    { label: "Deezer", value: "deezer" },
    { label: "Spotify", value: "spotify" },
    { label: "YouTube Music", value: "youtube_music" },
  ]);
});

it("persists each selection without storing actions or hydration state", async () => {
  const { STREAMING_SERVICES, useUserSettingsStore } = await loadStore();
  for (const value of Object.keys(STREAMING_SERVICES) as (keyof typeof STREAMING_SERVICES)[]) {
    useUserSettingsStore.getState().setStreamingService(value);
    expect(useUserSettingsStore.getState().streamingService).toBe(value);
    expect(JSON.parse(saved.get("user-settings") ?? "null")).toEqual({
      state: { folgenListViewMode: "grid", streamingService: value },
      version: 1,
    });
  }
  useUserSettingsStore.getState().setStreamingService(null);
  expect(JSON.parse(saved.get("user-settings") ?? "null")).toEqual({
    state: { folgenListViewMode: "grid", streamingService: null },
    version: 1,
  });
});

it("restores the selected service after a fresh module load", async () => {
  const first = await loadStore();
  first.useUserSettingsStore.getState().setStreamingService("deezer");
  vi.resetModules();
  const second = await loadStore();
  expect(second.useUserSettingsStore.getState().streamingService).toBe(
    "deezer",
  );
});

it("persists and restores the selected Folgen list view mode", async () => {
  const first = await loadStore();
  first.useUserSettingsStore.getState().setFolgenListViewMode("list");
  expect(JSON.parse(saved.get("user-settings") ?? "null")).toEqual({
    state: { folgenListViewMode: "list", streamingService: "spotify" },
    version: 1,
  });

  vi.resetModules();
  const second = await loadStore();
  expect(second.useUserSettingsStore.getState().folgenListViewMode).toBe("list");
});

it("notifies subscribers when the selected service changes", async () => {
  const { useUserSettingsStore } = await loadStore();
  const subscriber = vi.fn();
  const unsubscribe = useUserSettingsStore.subscribe(subscriber);
  useUserSettingsStore.getState().setStreamingService("apple_music");
  expect(subscriber).toHaveBeenCalledTimes(1);
  unsubscribe();
});

it("does not access browser storage during server rendering", async () => {
  platform.OS = "web";
  const { useUserSettingsStore } = await import("./use-user-settings-store");
  expect(storage.getItem).not.toHaveBeenCalled();
  expect(useUserSettingsStore.getState().hasHydrated).toBe(false);
});

it("does not overwrite saved settings before hydration completes", async () => {
  let resolveStorage: (value: string) => void = () => undefined;
  storage.getItem.mockImplementationOnce(
    () =>
      new Promise<string>((resolve) => {
        resolveStorage = resolve;
      }),
  );
  const { useUserSettingsStore } = await import("./use-user-settings-store");
  expect(useUserSettingsStore.getState().hasHydrated).toBe(false);
  expect(storage.setItem).not.toHaveBeenCalled();
  resolveStorage(
    JSON.stringify({ state: { streamingService: "spotify" }, version: 1 }),
  );
  await vi.waitFor(() => {
    expect(useUserSettingsStore.getState().hasHydrated).toBe(true);
  });
  expect(useUserSettingsStore.getState().streamingService).toBe("spotify");
});

it("reports hydration errors without overwriting saved settings", async () => {
  const error = new Error("Storage unavailable");
  const log = vi.spyOn(console, "error").mockImplementation(() => undefined);
  try {
    storage.getItem.mockRejectedValueOnce(error);
    const { useUserSettingsStore } = await import("./use-user-settings-store");
    await vi.waitFor(() => {
      expect(log).toHaveBeenCalledWith("Failed to load user settings:", error);
    });
    expect(useUserSettingsStore.getState().hasHydrated).toBe(false);
    expect(storage.setItem).not.toHaveBeenCalled();
  } finally {
    log.mockRestore();
  }
});
