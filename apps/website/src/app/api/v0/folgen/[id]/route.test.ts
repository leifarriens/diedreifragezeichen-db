import { NextRequest } from "next/server";
import { afterEach, beforeEach, expect, it, vi } from "vitest";

import { getFolgeWithCommunityRatingById } from "@/server/queries/folgen";

import { GET } from "./route";

vi.mock("@/server/queries/folgen", () => ({
  getFolgeWithCommunityRatingById: vi.fn(),
}));

beforeEach(() => {
  vi.resetAllMocks();
});

afterEach(() => {
  vi.restoreAllMocks();
});

it("returns an empty 404 response for a missing episode", async () => {
  vi.mocked(getFolgeWithCommunityRatingById).mockResolvedValue(null);

  const response = await GET(
    new NextRequest("http://localhost/api/v0/folgen/4655"),
    { params: Promise.resolve({ id: "4655" }) },
  );

  expect(response.status).toBe(404);
  expect(await response.text()).toBe("");
  expect(getFolgeWithCommunityRatingById).toHaveBeenCalledWith(4655);
});

it.each(["1abc", "1.2", "-1", "0", "9007199254740992", "1\n"])(
  "returns 400 for invalid episode ID %s",
  async (id) => {
    const response = await GET(
      new NextRequest("http://localhost/api/v0/folgen/invalid"),
      { params: Promise.resolve({ id }) },
    );

    expect(response.status).toBe(400);
    expect(getFolgeWithCommunityRatingById).not.toHaveBeenCalled();
  },
);

it("converts leading-zero episode IDs before lookup", async () => {
  vi.mocked(getFolgeWithCommunityRatingById).mockResolvedValue(null);

  const response = await GET(
    new NextRequest("http://localhost/api/v0/folgen/0001"),
    { params: Promise.resolve({ id: "0001" }) },
  );

  expect(response.status).toBe(404);
  expect(getFolgeWithCommunityRatingById).toHaveBeenCalledWith(1);
});

it("keeps unexpected failures as server errors", async () => {
  const error = new Error("Archive unavailable");
  vi.mocked(getFolgeWithCommunityRatingById).mockRejectedValue(error);
  const log = vi.spyOn(console, "error").mockImplementation(() => undefined);

  const response = await GET(
    new NextRequest("http://localhost/api/v0/folgen/1"),
    { params: Promise.resolve({ id: "1" }) },
  );

  expect(response.status).toBe(500);
  expect(log).toHaveBeenCalledWith(error);
});
