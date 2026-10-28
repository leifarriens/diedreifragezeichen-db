import type { StreamingService } from "@ddfdb/core";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { FolgenListViewMode } from "@/features/folgen-list/types";

interface UserSettingsStore {
  folgenListViewMode: FolgenListViewMode | null;
  hasHydrated: boolean;
  setFolgenListViewMode: (viewMode: FolgenListViewMode | null) => void;
  setHasHydrated: () => void;
  setStreamingService: (service: null | StreamingService) => void;
  streamingService: null | StreamingService;
}

export const useUserSettingsStore = create<UserSettingsStore>()(
  persist(
    (set) => ({
      folgenListViewMode: "grid",
      hasHydrated: false,
      setFolgenListViewMode: (folgenListViewMode) => {
        set({ folgenListViewMode });
      },
      setHasHydrated: () => {
        set({ hasHydrated: true });
      },
      setStreamingService: (streamingService) => {
        set({ streamingService });
      },
      streamingService: "spotify",
    }),
    {
      name: "user-settings",
      onRehydrateStorage: (state) => (_state, error: unknown) => {
        if (error) {
          console.error("Failed to load user settings:", error);
          return;
        }
        state.setHasHydrated();
      },
      partialize: ({ folgenListViewMode, streamingService }) => ({
        folgenListViewMode,
        streamingService,
      }),
      storage:
        Platform.OS === "web" && typeof window === "undefined"
          ? undefined
          : createJSONStorage(() => AsyncStorage),
      version: 1,
    },
  ),
);
