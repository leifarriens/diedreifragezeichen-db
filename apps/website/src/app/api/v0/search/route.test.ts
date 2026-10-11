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
      new Request("http://localhost/api/v0/search?q=1999"),
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
