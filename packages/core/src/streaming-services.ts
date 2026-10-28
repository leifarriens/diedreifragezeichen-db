export const STREAMING_SERVICES = {
  amazonMusic: "Amazon Music",
  appleMusic: "Apple Music",
  deezer: "Deezer",
  spotify: "Spotify",
  youtubeMusic: "YouTube Music",
} as const;

export type StreamingService = keyof typeof STREAMING_SERVICES;
