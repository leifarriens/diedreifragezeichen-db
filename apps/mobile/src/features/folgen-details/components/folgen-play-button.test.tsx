import type { StreamingService } from "@ddfdb/core";

import { beforeEach, expect, it, vi } from "vitest";

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
  useUserSettingsStore: (selector: (state: typeof settings) => unknown) =>
    selector(settings),
}));

const streaming = {
  amazonMusic: {
    id: "amazon-id",
    link: "https://music.amazon.de/albums/amazon-id",
  },
  appleMusic: {
    id: "apple-id",
    link: "https://music.apple.com/de/album/apple-id",
  },
  deezer: {
    id: "deezer-id",
    link: "https://www.deezer.com/de/album/deezer-id",
  },
  spotify: {
    id: "spotify-id",
    link: "https://open.spotify.com/album/spotify-id",
  },
  youtubeMusic: {
    id: "youtube-id",
    link: "https://music.youtube.com/browse/youtube-id",
  },
};

beforeEach(() => {
  settings.hasHydrated = true;
  settings.streamingService = "spotify";
});

it.each<StreamingService>([
  "amazonMusic",
  "appleMusic",
  "deezer",
  "spotify",
  "youtubeMusic",
])("uses the selected %s streaming link", (service) => {
  settings.streamingService = service;
  const button = FolgenPlayButton({ streaming });
  expect(button).toMatchObject({
    props: {
      asChild: true,
      children: { props: { label: "Play" } },
      href: streaming[service].link,
    },
  });
});

it("uses a descriptive accessibility label for the selected service", () => {
  expect(FolgenPlayButton({ streaming })).toMatchObject({
    props: {
      children: {
        props: { accessibilityLabel: "Auf Spotify Abspielen" },
      },
    },
  });
});

it("hides the button until settings have hydrated", () => {
  settings.hasHydrated = false;
  expect(FolgenPlayButton({ streaming })).toMatchObject({ type: "View" });
});

it("hides the button when no streaming service is selected", () => {
  settings.streamingService = null;
  expect(FolgenPlayButton({ streaming })).toMatchObject({ type: "View" });
});

it("does not fall back to Spotify when the selected service has no link", () => {
  settings.streamingService = "deezer";
  expect(
    FolgenPlayButton({ streaming: { spotify: streaming.spotify } }),
  ).toMatchObject({
    type: "View",
  });
});

it("hides the button for an empty link", () => {
  expect(
    FolgenPlayButton({
      streaming: { spotify: { id: "spotify-id", link: "" } },
    }),
  ).toMatchObject({
    type: "View",
  });
});

it("uses a changed streaming-service preference", () => {
  expect(FolgenPlayButton({ streaming })).toMatchObject({
    props: { href: streaming.spotify.link },
  });
  settings.streamingService = "appleMusic";
  expect(FolgenPlayButton({ streaming })).toMatchObject({
    props: { href: streaming.appleMusic.link },
  });
});
