import { beforeEach, expect, it, vi } from "vitest";

import type { StreamingService } from "../../settings/hooks/use-user-settings-store";

import { FolgenPlayButton } from "./folgen-play-button";

const { settings } = vi.hoisted(() => {
  const settings: {
    hasHydrated: boolean;
    streamingService: null | StreamingService;
  } = {
    hasHydrated: true,
    streamingService: "spotify",
  };
  return { settings };
});

vi.mock("expo-router", () => ({ Link: "Link" }));
vi.mock("react-native", () => ({ View: "View" }));
vi.mock("@/components/ui/button", () => ({ UIButton: "UIButton" }));
vi.mock("@/features/settings/hooks/use-user-settings-store", () => ({
  STREAMING_SERVICES: {
    amazon_music: "Amazon Music",
    apple_music: "Apple Music",
    deezer: "Deezer",
    spotify: "Spotify",
    youtube_music: "YouTube Music",
  },
  useUserSettingsStore: (selector: (state: typeof settings) => unknown) =>
    selector(settings),
}));

const links = {
  amazon_music: "https://music.amazon.de/albums/amazon-id",
  apple_music: "https://music.apple.com/de/album/apple-id",
  deezer: "https://www.deezer.com/de/album/deezer-id",
  spotify: "https://open.spotify.com/album/spotify-id",
  youtube_music: "https://music.youtube.com/browse/youtube-id",
};

beforeEach(() => {
  settings.hasHydrated = true;
  settings.streamingService = "spotify";
});

it.each<StreamingService>([
  "amazon_music",
  "apple_music",
  "deezer",
  "spotify",
  "youtube_music",
])("uses the selected %s streaming link", (service) => {
  settings.streamingService = service;
  const button = FolgenPlayButton({ links });
  expect(button).toMatchObject({
    props: {
      asChild: true,
      children: { props: { label: "Play" } },
      href: links[service],
    },
  });
});

it("uses a descriptive accessibility label for the selected service", () => {
  expect(FolgenPlayButton({ links })).toMatchObject({
    props: {
      children: {
        props: { accessibilityLabel: "Auf Spotify Abspielen" },
      },
    },
  });
});

it("hides the button until settings have hydrated", () => {
  settings.hasHydrated = false;
  expect(FolgenPlayButton({ links })).toMatchObject({ type: "View" });
});

it("hides the button when no streaming service is selected", () => {
  settings.streamingService = null;
  expect(FolgenPlayButton({ links })).toMatchObject({ type: "View" });
});

it("does not fall back to Spotify when the selected service has no link", () => {
  settings.streamingService = "deezer";
  expect(FolgenPlayButton({ links: { spotify: links.spotify } })).toMatchObject(
    {
      type: "View",
    },
  );
});

it("hides the button for an empty link", () => {
  expect(FolgenPlayButton({ links: { spotify: "" } })).toMatchObject({
    type: "View",
  });
});

it("uses a changed streaming-service preference", () => {
  expect(FolgenPlayButton({ links })).toMatchObject({
    props: { href: links.spotify },
  });
  settings.streamingService = "apple_music";
  expect(FolgenPlayButton({ links })).toMatchObject({
    props: { href: links.apple_music },
  });
});
