import type { Folge } from "@ddfdb/archiv/contracts";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const folge: Folge = {
  artwork: null,
  authors: [],
  collection: "serie",
  cover: null,
  description: null,
  id: 1,
  number: 1,
  releaseDate: null,
  scriptAuthors: [],
  streaming: {},
  title: "Der Super-Papagei",
  totalDuration: null,
  voiceRoles: [],
  weblink: null,
};

beforeEach(() => {
  vi.resetModules();
  vi.stubEnv("EXPO_PUBLIC_DDFDB_ARCHIV_API_URL", "http://localhost:8080///");
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("mobile archive API adapter", () => {
  it("uses the shared client with the public Expo URL and platform fetch", async () => {
    const { archivApi } = await import("./archiv");
    const { ArchivApi } = await import("@ddfdb/client/archiv");
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify([folge])));
    vi.stubGlobal("fetch", fetchMock);

    expect(archivApi).toBeInstanceOf(ArchivApi);
    await expect(archivApi.getFolgen()).resolves.toEqual([folge]);
    expect(fetchMock).toHaveBeenCalledWith("http://localhost:8080/folgen", {
      headers: { Accept: "application/json" },
      method: "GET",
    });
  });

  it("encodes episode IDs and forwards caller cancellation without adding caching or timeouts", async () => {
    const { archivApi } = await import("./archiv");
    const signal = new AbortController().signal;
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify(folge)));
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      archivApi.getFolgeById("id/with space", { signal }),
    ).resolves.toEqual(folge);
    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:8080/folgen/id%2Fwith%20space",
      {
        headers: { Accept: "application/json" },
        method: "GET",
        signal,
      },
    );
  });

  it.each([undefined, ""])(
    "rejects missing API configuration: %s",
    async (url) => {
      vi.stubEnv("EXPO_PUBLIC_DDFDB_ARCHIV_API_URL", url);
      await expect(import("./archiv")).rejects.toThrow("Invalid API URL");
    },
  );

  it("rejects an invalid configured URL", async () => {
    vi.stubEnv("EXPO_PUBLIC_DDFDB_ARCHIV_API_URL", "not-a-url");
    await expect(import("./archiv")).rejects.toThrow(TypeError);
  });

  it("uses shared response validation", async () => {
    const { archivApi } = await import("./archiv");
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(new Response(JSON.stringify([{ id: "invalid" }]))),
    );

    await expect(archivApi.getFolgen()).rejects.toMatchObject({
      code: "invalid-response",
      name: "ArchivApiError",
    });
  });

  it("preserves HTTP status in the shared error", async () => {
    const { archivApi } = await import("./archiv");
    const { ArchivApiError } = await import("@ddfdb/client/archiv");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(null, { status: 503 })),
    );

    await expect(archivApi.getFolgen()).rejects.toBeInstanceOf(ArchivApiError);
    await expect(archivApi.getFolgen()).rejects.toMatchObject({
      code: "http",
      status: 503,
    });
  });
});
