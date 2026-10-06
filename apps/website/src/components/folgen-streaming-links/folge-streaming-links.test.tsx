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
          links={{
            apple_music: "https://music.apple.com/episode",
            deezer: "https://www.deezer.com/episode",
            spotify: "https://open.spotify.com/episode",
            youtube_music: "https://music.youtube.com/episode",
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
      expect(link.querySelector("svg")?.getAttribute("aria-hidden")).toBe(
        "true",
      );
      expect(link.querySelector("svg title")?.textContent).toBe(service);
    }
  });

  it("keeps named links for services without a supplied icon", () => {
    render(
      <FolgenStreamingLinks
        links={{
          amazon_music: "https://music.amazon.de/album",
          bookbeat: "https://www.bookbeat.com/episode",
        }}
      />,
    );

    expect(
      screen.getByRole("link", { name: externalLinkLabel("Amazon Music") }),
    ).toBeTruthy();
    expect(
      screen.getByRole("link", { name: externalLinkLabel("BookBeat") }),
    ).toBeTruthy();
  });
});
