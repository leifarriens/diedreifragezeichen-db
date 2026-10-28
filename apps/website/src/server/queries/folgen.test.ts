import { ArchivApiError } from "@ddfdb/client/archiv";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  getAllFolgenWithCommunityRatings,
  getFolgeListItems,
  getFolgeWithCommunityRatingById,
} from "./folgen";
import { getAllCommunityRatings } from "./ratings";

const { getFolgen } = vi.hoisted(() => ({
  getFolgen: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("@ddfdb/legacy-api", () => ({ getFolgeByMongoId: vi.fn() }));
vi.mock("next/cache", () => ({
  cacheLife: vi.fn(),
  cacheTag: vi.fn(),
}));
vi.mock("../archiv-api", () => ({
  archivApi: { getFolgen },
}));
vi.mock("./ratings", () => ({
  getAllCommunityRatings: vi.fn(),
}));

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(getAllCommunityRatings).mockResolvedValue([]);
});

describe("getFolgeListItems", () => {
  const folge = {
    artwork: "https://example.com/artwork.jpg",
    authors: ["Robert Arthur"],
    collection: "serie",
    cover: "https://example.com/cover.jpg",
    description: "A full episode description",
    id: 1,
    number: 1,
    releaseDate: "1979-10-12",
    scriptAuthors: ["H. G. Francis"],
    streaming: {
      spotify: { id: "spotify-id", link: "https://open.spotify.com/album/id" },
    },
    title: "Der Super-Papagei",
    totalDuration: 3600,
    voiceRoles: [{ role: "Justus Jonas", speaker: "Oliver Rohrbeck" }],
    weblink: "https://example.com/episode",
  };

  it("projects only list fields and the community rating score", async () => {
    getFolgen.mockResolvedValue([folge]);
    vi.mocked(getAllCommunityRatings).mockResolvedValue([
      {
        folgeId: 1,
        numberOfRatings: 10,
        popularity: 0.8,
        score: 4.5,
        updatedAt: "2026-01-01T00:00:00.000Z",
      },
    ]);

    await expect(getFolgeListItems()).resolves.toStrictEqual([
      {
        artwork: folge.artwork,
        authors: folge.authors,
        collection: folge.collection,
        communityRating: { score: 4.5 },
        cover: folge.cover,
        id: folge.id,
        number: folge.number,
        releaseDate: folge.releaseDate,
        scriptAuthors: folge.scriptAuthors,
        title: folge.title,
        totalDuration: folge.totalDuration,
        voiceRoles: folge.voiceRoles,
      },
    ]);
    expect(getFolgen).toHaveBeenCalledOnce();
    expect(getAllCommunityRatings).toHaveBeenCalledOnce();
    expect(folge.description).toBe("A full episode description");
  });

  it("preserves null fields and missing ratings", async () => {
    getFolgen.mockResolvedValue([
      {
        ...folge,
        artwork: null,
        cover: null,
        number: null,
        releaseDate: null,
        totalDuration: null,
      },
    ]);

    const [item] = await getFolgeListItems();

    expect(item).toMatchObject({
      artwork: null,
      communityRating: null,
      cover: null,
      number: null,
      releaseDate: null,
      totalDuration: null,
    });
  });

  it("returns an empty list when no episodes exist", async () => {
    getFolgen.mockResolvedValue([]);

    await expect(getFolgeListItems()).resolves.toStrictEqual([]);
  });

  it("leaves the full-record query unchanged", async () => {
    getFolgen.mockResolvedValue([folge]);

    await expect(getAllFolgenWithCommunityRatings()).resolves.toStrictEqual([
      { ...folge, communityRating: null },
    ]);
  });
});

describe("getFolgeWithCommunityRatingById", () => {
  it("returns null when the requested episode is absent from the list", async () => {
    getFolgen.mockResolvedValue([{ id: 1 }]);

    await expect(getFolgeWithCommunityRatingById(4655)).resolves.toBeNull();
    expect(getFolgen).toHaveBeenCalledOnce();
  });

  it("returns null when the archive is empty", async () => {
    getFolgen.mockResolvedValue([]);

    await expect(getFolgeWithCommunityRatingById(1)).resolves.toBeNull();
  });

  it.each([
    new ArchivApiError("Archive unavailable", "http", 503),
    new ArchivApiError("Network failure", "network"),
    new Error("Unexpected failure"),
  ])("preserves other errors: %s", async (error) => {
    getFolgen.mockRejectedValue(error);

    await expect(getFolgeWithCommunityRatingById(1)).rejects.toBe(error);
  });

  it("returns the matching episode without a rating when none exists", async () => {
    const folge = {
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
    } as const;
    getFolgen.mockResolvedValue([{ ...folge, id: 2 }, folge]);

    await expect(getFolgeWithCommunityRatingById(1)).resolves.toEqual({
      ...folge,
      communityRating: null,
    });
    expect(getFolgen).toHaveBeenCalledOnce();
    expect(getAllCommunityRatings).toHaveBeenCalledOnce();
  });

  it("enriches the matching episode with its community rating", async () => {
    const folge = { id: 1 };
    const communityRating = {
      numberOfRatings: 10,
      popularity: 0.8,
      score: 4.5,
      updatedAt: "2026-01-01T00:00:00.000Z",
    };
    getFolgen.mockResolvedValue([{ id: 2 }, folge]);
    vi.mocked(getAllCommunityRatings).mockResolvedValue([
      { ...communityRating, folgeId: 2, score: 3 },
      { ...communityRating, folgeId: 1 },
    ]);

    await expect(getFolgeWithCommunityRatingById(1)).resolves.toStrictEqual({
      ...folge,
      communityRating,
    });
  });
});
