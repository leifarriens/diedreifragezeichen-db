import { ArchivApiError } from "@ddfdb/client/archiv";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  getAllFolgenWithCommunityRatings,
  getFolgeListItems,
  getFolgeWithCommunityRatingById,
} from "./folgen";
import { getAllCommunityRatings, getCommunityRatingForFolge } from "./ratings";

const { getFolgeById, getFolgen } = vi.hoisted(() => ({
  getFolgeById: vi.fn(),
  getFolgen: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("@ddfdb/legacy-api", () => ({ getFolgeByMongoId: vi.fn() }));
vi.mock("next/cache", () => ({
  cacheLife: vi.fn(),
  cacheTag: vi.fn(),
}));
vi.mock("../archiv-api", () => ({
  archivApi: { getFolgeById, getFolgen },
  ArchivApiError,
}));
vi.mock("./ratings", () => ({
  getAllCommunityRatings: vi.fn(),
  getCommunityRatingForFolge: vi.fn(),
}));

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(getAllCommunityRatings).mockResolvedValue([]);
  vi.mocked(getCommunityRatingForFolge).mockResolvedValue(null);
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
    release_date: "1979-10-12",
    script_authors: ["H. G. Francis"],
    streaming: {
      spotify: { id: "spotify-id", link: "https://open.spotify.com/album/id" },
    },
    title: "Der Super-Papagei",
    total_duration: 3600,
    voice_roles: [{ role: "Justus Jonas", speaker: "Oliver Rohrbeck" }],
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
        release_date: folge.release_date,
        script_authors: folge.script_authors,
        title: folge.title,
        voice_roles: folge.voice_roles,
      },
    ]);
    expect(getFolgen).toHaveBeenCalledOnce();
    expect(getAllCommunityRatings).toHaveBeenCalledOnce();
    expect(folge.description).toBe("A full episode description");
  });

  it("preserves null fields and missing ratings", async () => {
    getFolgen.mockResolvedValue([
      { ...folge, artwork: null, cover: null, number: null, release_date: null },
    ]);

    const [item] = await getFolgeListItems();

    expect(item).toMatchObject({
      artwork: null,
      communityRating: null,
      cover: null,
      number: null,
      release_date: null,
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
