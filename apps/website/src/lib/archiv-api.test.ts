import { afterEach, describe, expect, it, vi } from "vitest";

import { CACHE_DURATION } from "@/constants/cache";

import { archivApi } from "./archiv-api";

const folge = {
  artwork: null,
  authors: [],
  collection: "serie",
  cover: "https://example.com/cover.webp",
  description: null,
  id: 1,
  number: 1,
  release_date: "1979-01-01",
  script_authors: [],
  streaming: {
    spotify: {
      id: "example",
      link: "https://open.spotify.com/album/example",
    },
  },
  title: "Der Super-Papagei",
  total_duration: 3_000,
  voice_roles: [],
  weblink: "https://example.com/folge/1",
} as const;

const { streaming, ...previousArchivFields } = folge;
const previousArchivFolge = {
  ...previousArchivFields,
  links: Object.fromEntries(
    Object.entries(streaming).map(([service, { link }]) => [service, link]),
  ),
};

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("archive API", () => {
  it("fetches and validates the public episode list", async () => {
    vi.stubEnv("DDFDB_ARCHIV_API_URL", "https://archive.example/");
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        new Response(JSON.stringify([folge]), { status: 200 }),
      );
    vi.stubGlobal("fetch", fetchMock);

    await expect(archivApi.getFolgen()).resolves.toEqual([folge]);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://archive.example/folgen",
      expect.objectContaining({ headers: { Accept: "application/json" } }),
    );
  });

  it("fetches and validates one episode by ID", async () => {
    vi.stubEnv("DDFDB_ARCHIV_API_URL", "https://archive.example/");
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify(folge), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(archivApi.getFolgeById(1)).resolves.toEqual(folge);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://archive.example/folgen/1",
      expect.objectContaining({
        headers: { Accept: "application/json" },
        next: { revalidate: CACHE_DURATION.ONE_HOUR },
      }),
    );
  });

  it("normalizes episodes from the previous Archiv response format", async () => {
    vi.stubEnv("DDFDB_ARCHIV_API_URL", "https://archive.example");
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce(
          new Response(JSON.stringify([previousArchivFolge]), { status: 200 }),
        )
        .mockResolvedValueOnce(
          new Response(JSON.stringify(previousArchivFolge), { status: 200 }),
        ),
    );

    await expect(archivApi.getFolgen()).resolves.toEqual([folge]);
    await expect(archivApi.getFolgeById(1)).resolves.toEqual(folge);
  });

  it("rejects an unsuccessful API response", async () => {
    vi.stubEnv("DDFDB_ARCHIV_API_URL", "https://archive.example");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(null, { status: 503 })),
    );

    await expect(archivApi.getFolgen()).rejects.toThrow(
      "Archiv API responded with HTTP 503",
    );
  });

  it("rejects malformed episode list data", async () => {
    vi.stubEnv("DDFDB_ARCHIV_API_URL", "https://archive.example");
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(
          new Response(JSON.stringify([{ id: "invalid" }]), { status: 200 }),
        ),
    );

    await expect(archivApi.getFolgen()).rejects.toThrow(
      "Archiv API returned an invalid Folgen response",
    );
  });

  it("rejects episodes with malformed streaming metadata", async () => {
    vi.stubEnv("DDFDB_ARCHIV_API_URL", "https://archive.example");
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(
          new Response(
            JSON.stringify([
              { ...folge, streaming: { spotify: { id: "example" } } },
            ]),
            { status: 200 },
          ),
        ),
    );

    await expect(archivApi.getFolgen()).rejects.toThrow(
      "Archiv API returned an invalid Folgen response",
    );
  });

  it("rejects malformed episode detail data", async () => {
    vi.stubEnv("DDFDB_ARCHIV_API_URL", "https://archive.example");
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(
          new Response(JSON.stringify({ id: "invalid" }), { status: 200 }),
        ),
    );

    await expect(archivApi.getFolgeById(1)).rejects.toThrow(
      "Archiv API returned an invalid Folge response",
    );
  });
});
