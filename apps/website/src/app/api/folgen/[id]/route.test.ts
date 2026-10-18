import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { getFolgeByMongoId } = vi.hoisted(() => ({
  getFolgeByMongoId: vi.fn(),
}));

vi.mock("next/cache", () => ({
  unstable_cache: (callback: unknown) => callback,
}));

vi.mock("@ddfdb/legacy-api", () => ({
  buildLegacyFolge: vi.fn(),
  getFolgeByMongoId,
  mongoObjectIdSchema: {
    safeParse: (id: string) => ({
      success: /^[\da-f]{24}$/i.test(id),
    }),
  },
  PUBLIC_API_CACHE_CONFIG: {
    cdn: { "Cache-Control": "public, s-maxage=28800" },
    cdnNotFound: { "Cache-Control": "public, s-maxage=3600" },
    server: { revalidate: 300 },
  },
}));

vi.mock("@/server/queries/folgen", () => ({
  getAllFolgenWithCommunityRatings: vi.fn(),
}));

import { GET } from "./route";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/folgen/[id]", () => {
  it("returns a 404 when the legacy episode does not exist", async () => {
    getFolgeByMongoId.mockResolvedValue(null);

    const response = await GET(
      new NextRequest("http://localhost/api/folgen/507f1f77bcf86cd799439011"),
      { params: Promise.resolve({ id: "507f1f77bcf86cd799439011" }) },
    );

    expect(response.status).toBe(404);
    expect(await response.text()).toBe("Not Found");
    expect(response.headers.get("Cache-Control")).toBe(
      "public, s-maxage=3600",
    );
  });
});
