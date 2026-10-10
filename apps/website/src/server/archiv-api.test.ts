import type { ArchivApi } from "@ddfdb/client/archiv";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

let archivApi: ArchivApi;

beforeEach(async () => {
  vi.resetModules();
  vi.stubEnv("DDFDB_ARCHIV_API_URL", "https://archive.example/");
  ({ archivApi } = await import("./archiv-api"));
});

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
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("archive API", () => {
  it("uses the shared API client", async () => {
    const { ArchivApi } = await import("@ddfdb/client/archiv");
    expect(archivApi).toBeInstanceOf(ArchivApi);
  });

  it("defaults to the local HTTP service when no URL is configured", async () => {
    vi.stubEnv("DDFDB_ARCHIV_API_URL", undefined);
    vi.resetModules();
    const { archivApi: localApi } = await import("./archiv-api");
    const fetchMock = vi.fn().mockResolvedValue(new Response("[]"));
    vi.stubGlobal("fetch", fetchMock);

    await expect(localApi.getFolgen()).resolves.toEqual([]);
    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:8080/folgen",
      expect.any(Object),
    );
  });

  it("applies the website timeout to each request", async () => {
    const signal = new AbortController().signal;
    const timeout = vi.spyOn(AbortSignal, "timeout").mockReturnValue(signal);
    const fetchMock = vi.fn().mockResolvedValue(new Response("[]"));
    vi.stubGlobal("fetch", fetchMock);

    await archivApi.getFolgen();
    expect(timeout).toHaveBeenCalledWith(8_000);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://archive.example/folgen",
      expect.objectContaining({ signal }),
    );
  });

  it("combines caller cancellation with the website timeout", async () => {
    const caller = new AbortController();
    const timeout = new AbortController();
    vi.spyOn(AbortSignal, "timeout").mockReturnValue(timeout.signal);
    let signal: AbortSignal | null | undefined;
    vi.stubGlobal(
      "fetch",
      vi.fn((_url: string, options: RequestInit) => {
        signal = options.signal;
        return Promise.resolve(new Response("[]"));
      }),
    );

    await archivApi.getFolgen({ signal: caller.signal });
    expect(signal).not.toBe(caller.signal);
    expect(signal).not.toBe(timeout.signal);
    caller.abort();
    expect(signal?.aborted).toBe(true);
    expect(signal?.reason).toBe(caller.signal.reason);
  });

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
      expect.objectContaining({
        headers: { Accept: "application/json" },
        next: { revalidate: 3600 },
      }),
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
        next: { revalidate: 3600 },
      }),
    );
  });

  it("preserves the status of a missing episode response", async () => {
    vi.stubEnv("DDFDB_ARCHIV_API_URL", "https://archive.example");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(null, { status: 404 })),
    );

    const { ArchivApiError } = await import("./archiv-api");
    const { ArchivApiError: SharedArchivApiError } =
      await import("@ddfdb/client/archiv");
    expect(ArchivApiError).toBe(SharedArchivApiError);

    await expect(archivApi.getFolgeById(440)).rejects.toMatchObject({
      name: "ArchivApiError",
      status: 404,
    });
  });

  it("rejects episodes from the previous Archiv response format", async () => {
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

    await expect(archivApi.getFolgen()).rejects.toMatchObject({
      code: "invalid-response",
    });
    await expect(archivApi.getFolgeById(1)).rejects.toMatchObject({
      code: "invalid-response",
    });
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
