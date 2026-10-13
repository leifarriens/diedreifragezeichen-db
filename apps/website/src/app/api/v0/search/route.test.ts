import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { searchArchiv } = vi.hoisted(() => ({ searchArchiv: vi.fn() }));

vi.mock("@/server/queries/archiv", () => ({ searchArchiv }));

import { GET } from "./route";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/v0/search", () => {
  it.each(["Geister", "GEISTER", "  geister  "])(
    "finds the same results for equivalent queries: %j",
    async (query) => {
      searchArchiv.mockResolvedValue([
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
      expect(searchArchiv).toHaveBeenCalledWith("geister");
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
      expect(searchArchiv).not.toHaveBeenCalled();
    },
  );

  it("finds episodes by release year", async () => {
    searchArchiv.mockResolvedValue([
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
    expect(searchArchiv).toHaveBeenCalledWith("1999");
  });
});
