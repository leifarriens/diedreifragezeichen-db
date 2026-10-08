import { describe, expect, it } from "vitest";

import { createFolgenFilter } from "./folgen-filter";

interface RatedTestFolge extends TestFolge {
  userRating: null | number;
}

interface TestFolge {
  collection: "serie" | "spezial";
  key: string;
  number: null | number;
  release_date: null | string;
  title: string;
}

function makeFolge(overrides: Partial<TestFolge> = {}): TestFolge {
  return {
    collection: "serie",
    key: "folge",
    number: 1,
    release_date: "2000-01-01",
    title: "Eine Folge",
    ...overrides,
  };
}

function makeRatedFolge(
  overrides: Partial<RatedTestFolge> = {},
): RatedTestFolge {
  return {
    ...makeFolge(),
    userRating: null,
    ...overrides,
  };
}

describe("createFolgenFilter", () => {
  it("searches titles, episode numbers, and release years", () => {
    const folgen = [
      makeFolge({ key: "title", title: "Der Super-Papagei" }),
      makeFolge({ key: "number", number: 42, title: "Andere Folge" }),
      makeFolge({ key: "year", release_date: "1999-06-12" }),
    ];

    expect(
      createFolgenFilter(folgen).search("  SUPER-PAPAGEI ").results(),
    ).toEqual([folgen[0]]);
    expect(createFolgenFilter(folgen).search("42").results()).toEqual([
      folgen[1],
    ]);
    expect(createFolgenFilter(folgen).search("1999").results()).toEqual([
      folgen[2],
    ]);
  });

  it("includes specials by default and can exclude them", () => {
    const folgen = [
      makeFolge({ key: "serie" }),
      makeFolge({ collection: "spezial", key: "special" }),
    ];

    expect(createFolgenFilter(folgen).results()).toEqual(folgen);
    expect(createFolgenFilter(folgen).showSpecials(false).results()).toEqual([
      folgen[0],
    ]);
  });

  it("filters years inclusively and excludes unknown dates for a bounded range", () => {
    const folgen = [
      makeFolge({ key: "start", release_date: "1990-01-01" }),
      makeFolge({ key: "end", release_date: "2000-12-31" }),
      makeFolge({ key: "before", release_date: "1989-12-31" }),
      makeFolge({ key: "after", release_date: "2001-01-01" }),
      makeFolge({ key: "unknown", release_date: null }),
    ];

    expect(
      createFolgenFilter(folgen)
        .yearRange({ endYear: 2000, startYear: 1990 })
        .results(),
    ).toEqual([folgen[0], folgen[1]]);
  });

  it("does not filter unknown dates when no year bounds are set", () => {
    const folgen = [
      makeFolge(),
      makeFolge({ key: "unknown", release_date: null }),
    ];

    expect(
      createFolgenFilter(folgen)
        .yearRange({ endYear: null, startYear: null })
        .results(),
    ).toEqual(folgen);
    expect(createFolgenFilter(folgen).results()).toEqual(folgen);
  });

  it("does not require user ratings unless the rating filter is used", () => {
    const folge = makeFolge();
    const filter = createFolgenFilter([folge]);

    expect(filter.results()).toEqual([folge]);

    // @ts-expect-error Rating-specific filtering requires userRating on each Folge.
    filter.showUserRated(false);
  });

  it("only filters rated Folgen when requested", () => {
    const folgen = [
      makeRatedFolge({ key: "unrated" }),
      makeRatedFolge({ key: "rated", userRating: 5 }),
      makeRatedFolge({ key: "zero-rating", userRating: 0 }),
    ];

    expect(createFolgenFilter(folgen).showUserRated(false).results()).toEqual([
      folgen[0],
    ]);
    expect(createFolgenFilter(folgen).showUserRated(true).results()).toEqual(
      folgen,
    );
  });

  it("keeps each composed filter independent", () => {
    const folgen = [
      makeFolge(),
      makeFolge({ collection: "spezial", key: "special" }),
    ];
    const filter = createFolgenFilter(folgen);

    expect(filter.results()).toEqual(folgen);
    expect(filter.showSpecials(false).results()).toEqual([folgen[0]]);
    expect(filter.results()).toEqual(folgen);
  });
});
