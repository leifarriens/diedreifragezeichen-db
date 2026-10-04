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

it("automatically loads an empty store without root-layout wiring", async () => {
  const { useFolgeStore } = await import("./use-folge-store");
  await vi.waitFor(() => {
    expect(useFolgeStore.getState().hasHydrated).toBe(true);
  });
  expect(useFolgeStore.getState().getFolgeStatus("folge-1")).toEqual({
    isBookmarked: false,
    isPlayed: false,
  });
});

it("does not access browser storage during server rendering", async () => {
  platform.OS = "web";
  const { useFolgeStore } = await import("./use-folge-store");
  expect(storage.getItem).not.toHaveBeenCalled();
  expect(useFolgeStore.getState().hasHydrated).toBe(false);
});

it("toggles each flag independently and persists only the two ID lists", async () => {
  const { useFolgeStore } = await import("./use-folge-store");
  await vi.waitFor(() => {
    expect(useFolgeStore.getState().hasHydrated).toBe(true);
  });
  useFolgeStore.getState().toggleBookmark("folge-1");
  useFolgeStore.getState().togglePlayed("folge-1");
  useFolgeStore.getState().toggleBookmark("folge-2");
  useFolgeStore.getState().toggleBookmark("folge-1");
  expect(useFolgeStore.getState().getFolgeStatus("folge-1")).toEqual({
    isBookmarked: false,
    isPlayed: true,
  });
  expect(useFolgeStore.getState().getFolgeStatus("folge-2")).toEqual({
    isBookmarked: true,
    isPlayed: false,
  });
  expect(JSON.parse(saved.get("folge-preferences") ?? "null")).toEqual({
    state: { bookmarkedFolgeIds: ["folge-2"], playedFolgeIds: ["folge-1"] },
    version: 1,
  });
  useFolgeStore.getState().togglePlayed("folge-1");
  expect(useFolgeStore.getState().playedFolgeIds).toEqual([]);
});

it("restores saved flags after a fresh module load", async () => {
  const first = await import("./use-folge-store");
  await vi.waitFor(() => {
    expect(first.useFolgeStore.getState().hasHydrated).toBe(true);
  });
  first.useFolgeStore.getState().toggleBookmark("folge-1");
  first.useFolgeStore.getState().togglePlayed("folge-1");
  vi.resetModules();
  const second = await import("./use-folge-store");
  await vi.waitFor(() => {
    expect(second.useFolgeStore.getState().hasHydrated).toBe(true);
  });
  expect(second.useFolgeStore.getState().getFolgeStatus("folge-1")).toEqual({
    isBookmarked: true,
    isPlayed: true,
  });
});

it("notifies subscribers when a Folge's status changes", async () => {
  const { useFolgeStore } = await import("./use-folge-store");
  await vi.waitFor(() => {
    expect(useFolgeStore.getState().hasHydrated).toBe(true);
  });
  const subscriber = vi.fn();
  const unsubscribe = useFolgeStore.subscribe(subscriber);
  useFolgeStore.getState().toggleBookmark("folge-1");
  expect(subscriber).toHaveBeenCalledTimes(1);
  expect(useFolgeStore.getState().getFolgeStatus("folge-1").isBookmarked).toBe(
    true,
  );
  unsubscribe();
});

it("reports the original hydration error instead of a generic message", async () => {
  const error = new Error("Native storage module unavailable");
  const log = vi.spyOn(console, "error").mockImplementation(() => undefined);
  try {
    storage.getItem.mockRejectedValueOnce(error);
    const { useFolgeStore } = await import("./use-folge-store");
    await vi.waitFor(() => {
      expect(log).toHaveBeenCalledWith(
        "Failed to load Folge preferences:",
        error,
      );
    });
    expect(useFolgeStore.getState().hasHydrated).toBe(false);
    expect(storage.setItem).not.toHaveBeenCalled();
  } finally {
    log.mockRestore();
  }
});
