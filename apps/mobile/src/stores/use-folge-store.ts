import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface SavedFolge {
  addedAt: number;
  folgeId: string;
}

interface FolgeStore {
  bookmarkedFolgen: SavedFolge[];
  getFolgeStatus: (folgeId: string) => {
    isBookmarked: boolean;
    isPlayed: boolean;
  };
  hasHydrated: boolean;
  playedFolgen: SavedFolge[];
  setHasHydrated: () => void;
  toggleBookmark: (folgeId: string) => void;
  togglePlayed: (folgeId: string) => void;
}

export const useFolgeStore = create<FolgeStore>()(
  persist(
    (set, get) => ({
      bookmarkedFolgen: [],
      getFolgeStatus: (folgeId) => ({
        isBookmarked: get().bookmarkedFolgen.some(
          (folge) => folge.folgeId === folgeId,
        ),
        isPlayed: get().playedFolgen.some((folge) => folge.folgeId === folgeId),
      }),
      hasHydrated: false,
      playedFolgen: [],
      setHasHydrated: () => {
        set({ hasHydrated: true });
      },
      toggleBookmark: (folgeId) => {
        set((state) => ({
          bookmarkedFolgen: toggleFolge(state.bookmarkedFolgen, folgeId),
        }));
      },
      togglePlayed: (folgeId) => {
        set((state) => ({
          playedFolgen: toggleFolge(state.playedFolgen, folgeId),
        }));
      },
    }),
    {
      migrate: (persistedState) => {
        const state =
          typeof persistedState === "object" && persistedState !== null
            ? (persistedState as Record<string, unknown>)
            : {};
        const migratedAt = Date.now();

        return {
          bookmarkedFolgen: migrateFolgen(
            state.bookmarkedFolgen,
            state.bookmarkedFolgeIds,
            migratedAt,
          ),
          playedFolgen: migrateFolgen(
            state.playedFolgen,
            state.playedFolgeIds,
            migratedAt,
          ),
        };
      },
      name: "folge-preferences",
      onRehydrateStorage: (state) => (_state, error: unknown) => {
        if (error) {
          console.error("Failed to load Folge preferences:", error);
          return;
        }
        state.setHasHydrated();
      },
      partialize: ({ bookmarkedFolgen, playedFolgen }) => ({
        bookmarkedFolgen,
        playedFolgen,
      }),
      storage:
        Platform.OS === "web" && typeof window === "undefined"
          ? undefined
          : createJSONStorage(() => AsyncStorage),
      version: 2,
    },
  ),
);

export function useFolgeStatus(folgeId: string) {
  const isBookmarked = useFolgeStore((state) =>
    state.bookmarkedFolgen.some((folge) => folge.folgeId === folgeId),
  );
  const isPlayed = useFolgeStore((state) =>
    state.playedFolgen.some((folge) => folge.folgeId === folgeId),
  );
  return { isBookmarked, isPlayed };
}

function isSaved(folgen: SavedFolge[], folgeId: string) {
  return folgen.some((folge) => folge.folgeId === folgeId);
}

function isSavedFolge(folge: unknown): folge is SavedFolge {
  return (
    typeof folge === "object" &&
    folge !== null &&
    "folgeId" in folge &&
    typeof folge.folgeId === "string" &&
    "addedAt" in folge &&
    typeof folge.addedAt === "number"
  );
}

function migrateFolgen(
  savedFolgen: unknown,
  legacyIds: unknown,
  migratedAt: number,
): SavedFolge[] {
  if (Array.isArray(savedFolgen)) {
    return savedFolgen.filter(isSavedFolge);
  }

  if (!Array.isArray(legacyIds)) return [];

  return legacyIds.flatMap((folgeId): SavedFolge[] =>
    typeof folgeId === "string" ? [{ addedAt: migratedAt, folgeId }] : [],
  );
}

function toggleFolge(folgen: SavedFolge[], folgeId: string): SavedFolge[] {
  return isSaved(folgen, folgeId)
    ? folgen.filter((folge) => folge.folgeId !== folgeId)
    : [...folgen, { addedAt: Date.now(), folgeId }];
}
