import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { searchFolgen } = vi.hoisted(() => ({ searchFolgen: vi.fn() }));

vi.mock("@/server/queries/search", () => ({ searchFolgen }));

import { GET } from "./route";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/v0/search", () => {
  it.each(["Geister", "GEISTER", "  geister  "])(
    "finds the same results for equivalent queries: %j",
    async (query) => {
      searchFolgen.mockResolvedValue([
        { cover: null, id: 1, number: 1, title: "Geisterhaus" },
      ]);

      const response = await GET(
        new NextRequest(
          `http://localhost/api/v0/search?q=${encodeURIComponent(query)}`,
        ),
      );

      await expect(response.json()).resolves.toEqual({
        results: [{ cover: null, id: 1, number: 1, title: "Geisterhaus" }],
      });
      expect(searchFolgen).toHaveBeenCalledWith("geister");
    },
  );

  it.each(["", "   ", "  A  "])(
    "rejects an empty or short normalized query without loading the archive: %j",
    async (query) => {
      const response = await GET(
        new NextRequest(
          `http://localhost/api/v0/search?q=${encodeURIComponent(query)}`,
        ),
      );

      expect(response.status).toBe(400);
      await expect(response.json()).resolves.toMatchObject({
        errors: { q: [expect.any(String)] },
      });
      expect(searchFolgen).not.toHaveBeenCalled();
    },
  );

  it("finds episodes by release year", async () => {
    searchFolgen.mockResolvedValue([
      {
        cover: "https://example.com/cover.webp",
        id: 1,
        number: 1,
        title: "A title unrelated to the query",
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
          number: 1,
          title: "A title unrelated to the query",
        },
      ],
    });
    expect(searchFolgen).toHaveBeenCalledWith("1999");
  });
});
