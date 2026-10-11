import { describe, expect, expectTypeOf, it } from "vitest";

import {
  sortFolgen,
  type UserRatingSortOption,
  type UserRatingUpdatedSortOption,
} from "./index";

interface BookmarkedTestFolge extends TestFolge {
  bookmarkedAt: null | string;
}

interface CommunityRatedTestFolge extends TestFolge {
  communityRating: null | { score: number };
}

interface TestFolge {
  id: number;
  key: string;
  release_date: null | string;
  title: string;
}

interface UserRatedTestFolge extends TestFolge {
  userRating: null | number;
  userRatingUpdatedAt: null | string;
}

const folgen: TestFolge[] = [
  { id: 1, key: "old", release_date: "1980-01-01", title: "Old" },
  { id: 2, key: "newest", release_date: "2020-01-01", title: "Newest" },
  { id: 3, key: "tie-b", release_date: "2000-01-01", title: "Folge B" },
  { id: 4, key: "tie-a", release_date: "2000-01-01", title: "Folge A" },
  { id: 5, key: "unknown", release_date: null, title: "Unknown" },
];

describe("sortFolgen", () => {
  it("accepts readonly input and preserves enriched types for every sort", () => {
    const enrichedFolgen = Object.freeze([
      {
        bookmarkedAt: "2025-01-01T00:00:00.000Z",
        communityRating: { score: 4.5, votes: 10 },
        id: 1,
        key: "enriched",
        release_date: "2000-01-01",
        title: "Enriched",
        userRating: 5,
        userRatingUpdatedAt: "2025-01-02T00:00:00.000Z",
      },
    ]);
    const results = [
      sortFolgen(enrichedFolgen, { by: "releaseDate", order: "newest" }),
      sortFolgen(enrichedFolgen, { by: "bookmarkedAt", order: "newest" }),
      sortFolgen(enrichedFolgen, {
        by: "communityRating",
        order: "highest",
      }),
      sortFolgen(enrichedFolgen, { by: "userRating", order: "highest" }),
      sortFolgen(enrichedFolgen, {
        by: "userRatingUpdatedAt",
        order: "newest",
      }),
    ];

    expectTypeOf(results).toEqualTypeOf<(typeof enrichedFolgen)[number][][]>();
    for (const sorted of results) {
      expect(sorted).toEqual(enrichedFolgen);
      expect(sorted).not.toBe(enrichedFolgen);
      expect(sorted[0]).toBe(enrichedFolgen[0]);
    }
  });

  it("breaks release-date and title ties by ID regardless of sort direction", () => {
    const tiedFolgen = [
      {
        id: 2,
        release_date: "2000-01-01T00:00:00.000Z",
        title: "Same title",
      },
      {
        id: 1,
        release_date: "2000-01-01T12:00:00.000Z",
        title: "Same title",
      },
    ];

    for (const order of ["newest", "oldest"] as const) {
      expect(
        sortFolgen(tiedFolgen, { by: "releaseDate", order }).map(
          ({ id }) => id,
        ),
      ).toEqual([1, 2]);
    }
  });

  it("sorts community ratings lowest first, treating zero as a rating", () => {
    const communityFolgen = [
      {
        communityRating: { score: 5 },
        id: 1,
        release_date: null,
        title: "Highest",
      },
      {
        communityRating: null,
        id: 2,
        release_date: null,
        title: "Unrated",
      },
      {
        communityRating: { score: 0 },
        id: 3,
        release_date: null,
        title: "Zero",
      },
    ];

    expect(
      sortFolgen(communityFolgen, {
        by: "communityRating",
        order: "lowest",
      }).map(({ id }) => id),
    ).toEqual([3, 1, 2]);
  });

  it("sorts by popularity and places Folgen without popularity last", () => {
    const popularFolgen = [
      {
        communityRating: { popularity: 6 },
        id: 1,
        release_date: "1980-01-01",
        title: "Older tie",
      },
      {
        communityRating: { popularity: 2 },
        id: 2,
        release_date: "2000-01-01",
        title: "Most popular",
      },
      {
        communityRating: { popularity: 4 },
        id: 3,
        release_date: "2010-01-01",
        title: "No popularity",
      },
      {
        communityRating: { popularity: 0 },
        id: 4,
        release_date: "2020-01-01",
        title: "Zero popularity",
      },
      {
        communityRating: null,
        id: 5,
        release_date: "1990-01-01",
        title: "Missing popularity",
      },
    ];

    expect(
      sortFolgen(popularFolgen, { by: "popularity", order: "highest" }).map(
        ({ id }) => id,
      ),
    ).toEqual([1, 3, 2, 4, 5]);

  });

  it("sorts by release date from newest to oldest", () => {
    expect(
      sortFolgen(folgen, { by: "releaseDate", order: "newest" }).map(
        ({ key }) => key,
      ),
    ).toEqual(["newest", "tie-a", "tie-b", "old", "unknown"]);
  });

  it("sorts by release date from oldest to newest", () => {
    expect(
      sortFolgen(folgen, { by: "releaseDate", order: "oldest" }).map(
        ({ key }) => key,
      ),
    ).toEqual(["old", "tie-a", "tie-b", "newest", "unknown"]);
  });

  it("sorts by bookmark date newest or oldest, keeping unknown dates last", () => {
    const bookmarkedFolgen: BookmarkedTestFolge[] = [
      {
        bookmarkedAt: "2025-01-01T00:00:00.000Z",
        id: 1,
        key: "oldest",
        release_date: null,
        title: "Oldest",
      },
      {
        bookmarkedAt: "2025-01-03T00:00:00.000Z",
        id: 2,
        key: "recent-b",
        release_date: null,
        title: "Bookmark B",
      },
      {
        bookmarkedAt: "2025-01-03T00:00:00.000Z",
        id: 3,
        key: "recent-a",
        release_date: null,
        title: "Bookmark A",
      },
      {
        bookmarkedAt: null,
        id: 4,
        key: "unknown",
        release_date: null,
        title: "Unknown",
      },
    ];

    expect(
      sortFolgen(bookmarkedFolgen, {
        by: "bookmarkedAt",
        order: "newest",
      }).map(({ id }) => id),
    ).toEqual([3, 2, 1, 4]);
    expect(
      sortFolgen(bookmarkedFolgen, {
        by: "bookmarkedAt",
        order: "oldest",
      }).map(({ id }) => id),
    ).toEqual([1, 3, 2, 4]);
  });

  it("sorts by community rating and places unrated Folgen last", () => {
    const communityFolgen: CommunityRatedTestFolge[] = [
      {
        communityRating: { score: 2 },
        id: 1,
        key: "low",
        release_date: "1980-01-01",
        title: "Old",
      },
      {
        communityRating: { score: 4 },
        id: 2,
        key: "highest-newest",
        release_date: "2020-01-01",
        title: "Newest",
      },
      {
        communityRating: null,
        id: 3,
        key: "unrated",
        release_date: "2000-01-01",
        title: "Unrated",
      },
      {
        communityRating: { score: 4 },
        id: 4,
        key: "highest-older",
        release_date: "2000-01-01",
        title: "Older",
      },
    ];

    expect(
      sortFolgen(communityFolgen, {
        by: "communityRating",
        order: "highest",
      }).map(({ id }) => id),
    ).toEqual([2, 4, 1, 3]);
  });

  it("sorts by user rating and places unrated Folgen last", () => {
    const ratedFolgen: UserRatedTestFolge[] = [
      {
        id: 1,
        key: "low",
        release_date: "1980-01-01",
        title: "Old",
        userRating: 2,
        userRatingUpdatedAt: "2025-01-01T00:00:00.000Z",
      },
      {
        id: 2,
        key: "highest-older",
        release_date: "2020-01-01",
        title: "Newest",
        userRating: 4,
        userRatingUpdatedAt: "2025-01-01T00:00:00.000Z",
      },
      {
        id: 3,
        key: "unrated",
        release_date: "2000-01-01",
        title: "Unrated",
        userRating: null,
        userRatingUpdatedAt: null,
      },
      {
        id: 4,
        key: "highest-recent",
        release_date: "2000-01-01",
        title: "Older",
        userRating: 4,
        userRatingUpdatedAt: "2025-01-02T00:00:00.000Z",
      },
    ];

    expect(
      sortFolgen(ratedFolgen, { by: "userRating", order: "highest" }).map(
        ({ id }) => id,
      ),
    ).toEqual([4, 2, 1, 3]);
    expect(
      sortFolgen(ratedFolgen, { by: "userRating", order: "lowest" }).map(
        ({ id }) => id,
      ),
    ).toEqual([1, 4, 2, 3]);
  });

  it("accepts a union sort option for component state", () => {
    const ratedFolgen: UserRatedTestFolge[] = [
      {
        id: 1,
        key: "rated",
        release_date: "2000-01-01",
        title: "Rated",
        userRating: 5,
        userRatingUpdatedAt: "2025-01-01T00:00:00.000Z",
      },
    ];
    const sortOption: UserRatingSortOption | UserRatingUpdatedSortOption = {
      by: "userRatingUpdatedAt",
      order: "newest",
    };

    expect(sortFolgen(ratedFolgen, sortOption)).toEqual(ratedFolgen);
  });

  it("sorts by the most recent user rating submission", () => {
    const ratedFolgen: UserRatedTestFolge[] = [
      {
        id: 1,
        key: "old-update",
        release_date: "1980-01-01",
        title: "Old",
        userRating: 6,
        userRatingUpdatedAt: "2025-01-01T00:00:00.000Z",
      },
      {
        id: 2,
        key: "newest-update",
        release_date: "2020-01-01",
        title: "Newest",
        userRating: 1,
        userRatingUpdatedAt: "2025-01-03T00:00:00.000Z",
      },
      {
        id: 3,
        key: "middle-update",
        release_date: "2000-01-01",
        title: "Middle",
        userRating: 4,
        userRatingUpdatedAt: "2025-01-02T00:00:00.000Z",
      },
    ];

    expect(
      sortFolgen(ratedFolgen, {
        by: "userRatingUpdatedAt",
        order: "newest",
      }).map(({ id }) => id),
    ).toEqual([2, 3, 1]);
  });

  it("allows release-date sorting without ratings and does not mutate input", () => {
    const sorted = sortFolgen(folgen, {
      by: "releaseDate",
      order: "newest",
    });

    expect(sorted).not.toBe(folgen);
    expect(folgen.map(({ key }) => key)).toEqual([
      "old",
      "newest",
      "tie-b",
      "tie-a",
      "unknown",
    ]);

    // @ts-expect-error Sorting by user rating requires userRating on each Folge.
    sortFolgen(folgen, { by: "userRating", order: "highest" });
    // @ts-expect-error Sorting by bookmark date requires bookmarkedAt on each Folge.
    sortFolgen(folgen, { by: "bookmarkedAt", order: "newest" });
    // @ts-expect-error Sorting by community rating requires communityRating on each Folge.
    sortFolgen(folgen, { by: "communityRating", order: "highest" });
    // @ts-expect-error Sorting by rating update date requires userRatingUpdatedAt on each Folge.
    sortFolgen(folgen, { by: "userRatingUpdatedAt", order: "newest" });
  });
});
