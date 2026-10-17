import { ArchivApiError } from "@ddfdb/client/archiv";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getFolgeWithCommunityRatingById } from "./folgen";
import { getCommunityRatingForFolge } from "./ratings";

const { getFolgeById } = vi.hoisted(() => ({ getFolgeById: vi.fn() }));

vi.mock("server-only", () => ({}));
vi.mock("@ddfdb/legacy-api", () => ({ getFolgeByMongoId: vi.fn() }));
vi.mock("next/cache", () => ({
  cacheLife: vi.fn(),
  cacheTag: vi.fn(),
}));
vi.mock("../archiv-api", () => ({
  archivApi: { getFolgeById },
  ArchivApiError,
}));
vi.mock("./ratings", () => ({
  getCommunityRatingForFolge: vi.fn(),
}));

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(getCommunityRatingForFolge).mockResolvedValue(null);
});

describe("getFolgeWithCommunityRatingById", () => {
  it("returns null for missing episodes before errors cross the cache boundary", async () => {
    getFolgeById.mockRejectedValue(
      new ArchivApiError("Episode not found", "http", 404),
    );

    await expect(getFolgeWithCommunityRatingById(4655)).resolves.toBeNull();
    expect(getFolgeById).toHaveBeenCalledWith(4655);
  });

  it.each([
    new ArchivApiError("Archive unavailable", "http", 503),
    new ArchivApiError("Network failure", "network"),
    new Error("Unexpected failure"),
  ])("preserves other errors: %s", async (error) => {
    getFolgeById.mockRejectedValue(error);

    await expect(getFolgeWithCommunityRatingById(1)).rejects.toBe(error);
  });

  it("enriches existing episodes", async () => {
    const folge = {
      artwork: null,
      authors: [],
      collection: "serie",
      cover: null,
      description: null,
      id: 1,
      number: 1,
      release_date: null,
      script_authors: [],
      streaming: {},
      title: "Der Super-Papagei",
      total_duration: null,
      voice_roles: [],
      weblink: null,
    } as const;
    getFolgeById.mockResolvedValue(folge);

    await expect(getFolgeWithCommunityRatingById(1)).resolves.toEqual({
      ...folge,
      communityRating: null,
    });
  });
});
