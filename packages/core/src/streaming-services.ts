export const STREAMING_SERVICES = {
  amazon_music: "Amazon Music",
  apple_music: "Apple Music",
  deezer: "Deezer",
  spotify: "Spotify",
  youtube_music: "YouTube Music",
} as const;

export type StreamingService = keyof typeof STREAMING_SERVICES;
