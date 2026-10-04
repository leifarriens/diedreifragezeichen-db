import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface FolgeStore {
  bookmarkedFolgeIds: string[];
  getFolgeStatus: (folgeId: string) => {
    isBookmarked: boolean;
    isPlayed: boolean;
  };
  hasHydrated: boolean;
  playedFolgeIds: string[];
  setHasHydrated: () => void;
  toggleBookmark: (folgeId: string) => void;
  togglePlayed: (folgeId: string) => void;
}

export const useFolgeStore = create<FolgeStore>()(
  persist(
    (set, get) => ({
      bookmarkedFolgeIds: [],
      getFolgeStatus: (folgeId) => ({
        isBookmarked: get().bookmarkedFolgeIds.includes(folgeId),
        isPlayed: get().playedFolgeIds.includes(folgeId),
      }),
      hasHydrated: false,
      playedFolgeIds: [],
      setHasHydrated: () => {
        set({ hasHydrated: true });
      },
      toggleBookmark: (folgeId) => {
        set((state) => ({
          bookmarkedFolgeIds: toggleId(state.bookmarkedFolgeIds, folgeId),
        }));
      },
      togglePlayed: (folgeId) => {
        set((state) => ({
          playedFolgeIds: toggleId(state.playedFolgeIds, folgeId),
        }));
      },
    }),
    {
      name: "folge-preferences",
      onRehydrateStorage: (state) => (_state, error: unknown) => {
        if (error) {
          console.error("Failed to load Folge preferences:", error);
          return;
        }
        state.setHasHydrated();
      },
      partialize: ({ bookmarkedFolgeIds, playedFolgeIds }) => ({
        bookmarkedFolgeIds,
        playedFolgeIds,
      }),
      storage:
        Platform.OS === "web" && typeof window === "undefined"
          ? undefined
          : createJSONStorage(() => AsyncStorage),
      version: 1,
    },
  ),
);

export function useFolgeStatus(folgeId: string) {
  const isBookmarked = useFolgeStore((state) =>
    state.bookmarkedFolgeIds.includes(folgeId),
  );
  const isPlayed = useFolgeStore((state) =>
    state.playedFolgeIds.includes(folgeId),
  );
  return { isBookmarked, isPlayed };
}

function toggleId(ids: string[], id: string) {
  return ids.includes(id) ? ids.filter((value) => value !== id) : [...ids, id];
}
