// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { FolgenStreamingLinks } from "./folge-streaming-links";

const externalLinkLabel = (service: string) =>
  `Öffnet ${service} in einem neuen Tab (externer Link)`;

afterEach(cleanup);

describe("FolgenStreamingLinks", () => {
  it("renders available service icons as accessible external links", () => {
    render(
      <div>
        <FolgenStreamingLinks
          streaming={{
            apple_music: {
              id: "apple-id",
              link: "https://music.apple.com/episode",
            },
            deezer: {
              id: "deezer-id",
              link: "https://www.deezer.com/episode",
            },
            spotify: {
              id: "spotify-id",
              link: "https://open.spotify.com/episode",
            },
            youtube_music: {
              id: "youtube-id",
              link: "https://music.youtube.com/episode",
            },
          }}
        />
      </div>,
    );

    for (const [service, href] of [
      ["Apple Music", "https://music.apple.com/episode"],
      ["Deezer", "https://www.deezer.com/episode"],
      ["Spotify", "https://open.spotify.com/episode"],
      ["YouTube Music", "https://music.youtube.com/episode"],
    ] as const) {
      const link = screen.getByRole("link", {
        name: externalLinkLabel(service),
      });

      expect(link.getAttribute("href")).toBe(href);
      expect(link.getAttribute("target")).toBe("_blank");
      expect(link.getAttribute("rel")).toBe("noopener noreferrer");
      expect(link.getAttribute("title")).toBe(service);
      expect(link.querySelector("svg")?.getAttribute("aria-hidden")).toBe(
        "true",
      );
    }
  });
});
