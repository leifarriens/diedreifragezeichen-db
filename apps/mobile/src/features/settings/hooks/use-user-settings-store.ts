import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const STREAMING_SERVICES = [
  { label: "Amazon Music", value: "amazon_music" },
  { label: "Apple Music", value: "apple_music" },
  { label: "Deezer", value: "deezer" },
  { label: "Spotify", value: "spotify" },
  { label: "YouTube Music", value: "youtube_music" },
] as const;

export const STREAMING_SERVICES_ = {
  amazon_music: "Amazon Music",
  apple_music: "Apple Music",
  deezer: "Deezer",
  spotify: "Spotify",
  youtube_music: "YouTube Music",
} as const;

export type StreamingService = (typeof STREAMING_SERVICES)[number]["value"];

interface UserSettingsStore {
  hasHydrated: boolean;
  setHasHydrated: () => void;
  setStreamingService: (service: null | StreamingService) => void;
  streamingService: null | StreamingService;
}

export const useUserSettingsStore = create<UserSettingsStore>()(
  persist(
    (set) => ({
      hasHydrated: false,
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
      partialize: ({ streamingService }) => ({ streamingService }),
      storage:
        Platform.OS === "web" && typeof window === "undefined"
          ? undefined
          : createJSONStorage(() => AsyncStorage),
      version: 1,
    },
  ),
);
