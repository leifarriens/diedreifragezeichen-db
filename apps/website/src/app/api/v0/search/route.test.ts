import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { getFolgen } = vi.hoisted(() => ({ getFolgen: vi.fn() }));

vi.mock("@/server/archiv-api", () => ({
  archivApi: { getFolgen },
}));

import { GET } from "./route";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/v0/search", () => {
  it.each(["Geister", "GEISTER", "  geister  "])(
    "finds the same results for equivalent queries: %j",
    async (query) => {
      getFolgen.mockResolvedValue([
        {
          collection: "serie",
          cover: null,
          id: 1,
          number: 1,
          release_date: null,
          title: "Geisterhaus",
        },
      ]);

      const response = await GET(
        new NextRequest(
          `http://localhost/api/v0/search?q=${encodeURIComponent(query)}`,
        ),
      );

      await expect(response.json()).resolves.toEqual({
        results: [{ cover: null, id: 1, title: "Geisterhaus" }],
      });
    },
  );

  it.each(["", "   ", "  A  "])(
    "does not load the archive for an empty or short normalized query: %j",
    async (query) => {
      const response = await GET(
        new NextRequest(
          `http://localhost/api/v0/search?q=${encodeURIComponent(query)}`,
        ),
      );

      await expect(response.json()).resolves.toEqual({ results: [] });
      expect(getFolgen).not.toHaveBeenCalled();
    },
  );

  it("finds episodes by release year", async () => {
    getFolgen.mockResolvedValue([
      {
        collection: "serie",
        cover: "https://example.com/cover.webp",
        id: 1,
        number: 1,
        release_date: "1999-06-12",
        title: "A title unrelated to the query",
      },
      {
        collection: "serie",
        cover: null,
        id: 2,
        number: 2,
        release_date: "2000-06-12",
        title: "Another unrelated title",
      },
    ]);

    const response = await GET(
      new NextRequest("http://localhost/api/v0/search?q=1999"),
    );

    await expect(response.json()).resolves.toEqual({
      results: [
        {
          cover: "https://example.com/cover.webp",
          id: 1,
          title: "A title unrelated to the query",
        },
      ],
    });
  });
});
