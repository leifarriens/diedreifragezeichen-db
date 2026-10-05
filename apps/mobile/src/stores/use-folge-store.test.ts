import { afterEach, beforeEach, expect, it, vi } from "vitest";

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

afterEach(() => {
  vi.restoreAllMocks();
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

it("toggles each flag independently and persists when each Folge was added", async () => {
  const { useFolgeStore } = await import("./use-folge-store");
  await vi.waitFor(() => {
    expect(useFolgeStore.getState().hasHydrated).toBe(true);
  });
  const now = vi.spyOn(Date, "now").mockReturnValue(100);
  useFolgeStore.getState().toggleBookmark("folge-1");
  now.mockReturnValue(200);
  useFolgeStore.getState().togglePlayed("folge-1");
  now.mockReturnValue(300);
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
    state: {
      bookmarkedFolgen: [{ addedAt: 300, folgeId: "folge-2" }],
      playedFolgen: [{ addedAt: 200, folgeId: "folge-1" }],
    },
    version: 2,
  });
  useFolgeStore.getState().togglePlayed("folge-1");
  expect(useFolgeStore.getState().playedFolgen).toEqual([]);
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
  expect(second.useFolgeStore.getState().bookmarkedFolgen[0]?.folgeId).toBe(
    "folge-1",
  );
  expect(
    typeof second.useFolgeStore.getState().bookmarkedFolgen[0]?.addedAt,
  ).toBe("number");
  expect(second.useFolgeStore.getState().playedFolgen[0]?.folgeId).toBe(
    "folge-1",
  );
  expect(typeof second.useFolgeStore.getState().playedFolgen[0]?.addedAt).toBe(
    "number",
  );
});

it("migrates saved ID lists and assigns a timestamp to existing Folgen", async () => {
  saved.set(
    "folge-preferences",
    JSON.stringify({
      state: {
        bookmarkedFolgeIds: ["folge-1"],
        playedFolgeIds: ["folge-2"],
      },
      version: 1,
    }),
  );
  vi.spyOn(Date, "now").mockReturnValue(1234);

  const { useFolgeStore } = await import("./use-folge-store");
  await vi.waitFor(() => {
    expect(useFolgeStore.getState().hasHydrated).toBe(true);
  });

  expect(useFolgeStore.getState().bookmarkedFolgen).toEqual([
    { addedAt: 1234, folgeId: "folge-1" },
  ]);
  expect(useFolgeStore.getState().playedFolgen).toEqual([
    { addedAt: 1234, folgeId: "folge-2" },
  ]);
  expect(JSON.parse(saved.get("folge-preferences") ?? "null")).toEqual({
    state: {
      bookmarkedFolgen: [{ addedAt: 1234, folgeId: "folge-1" }],
      playedFolgen: [{ addedAt: 1234, folgeId: "folge-2" }],
    },
    version: 2,
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
