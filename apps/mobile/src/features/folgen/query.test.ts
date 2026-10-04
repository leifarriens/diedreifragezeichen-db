import { describe, expect, it } from "vitest";

import type { Folge } from "../../api/types";

import { createFolgenQuery } from "./query";

function episode(id: string, overrides: Partial<Folge> = {}): Folge {
  return {
    _id: id,
    created_at: "2022-01-01T00:00:00.000Z",
    images: [],
    inhalt: "",
    name: `Episode ${id}`,
    number: id,
    number_of_ratings: 0,
    popularity: 0,
    rating: 0,
    release_date: "2022-01-01",
    spotify_id: "",
    sprecher: "",
    type: "episode",
    updated_at: "2022-01-01T00:00:00.000Z",
    weblink: "",
    ...overrides,
  };
}

describe("createFolgenQuery", () => {
  it("preserves input order and includes specials when no operation is configured", () => {
    const folgen = [episode("2", { type: "special" }), episode("1")];
    const results = createFolgenQuery(folgen).results();

    expect(results).toEqual(folgen);
    expect(results).not.toBe(folgen);
    expect(createFolgenQuery(folgen).results()).not.toBe(results);
  });

  it("searches titles, numbers, and exact release years case-insensitively", () => {
    const folgen = [
      episode("1", { name: "Das große Abenteuer" }),
      episode("42", { name: "Ein ruhiger Tag" }),
      episode("3", { release_date: "2020-03-11" }),
    ];

    expect(createFolgenQuery(folgen).search(" ABENTEUER ").results()).toEqual([
      folgen[0],
    ]);
    expect(createFolgenQuery(folgen).search("42").results()).toEqual([
      folgen[1],
    ]);
    expect(createFolgenQuery(folgen).search("2020").results()).toEqual([
      folgen[2],
    ]);
  });

  it("treats search input literally and clears a search when given whitespace", () => {
    const folgen = [
      episode("1", { name: "Die [Sonderfolge]" }),
      episode("2", { name: "Ein Abenteuer" }),
    ];

    expect(createFolgenQuery(folgen).search("[").results()).toEqual([
      folgen[0],
    ]);
    expect(
      createFolgenQuery(folgen).search("Abenteuer").search("  ").results(),
    ).toEqual(folgen);
  });

  it("filters an inclusive date range with either boundary optional", () => {
    const folgen = [
      episode("1", { release_date: "2022-01-01T08:00:00" }),
      episode("2", { release_date: "2022-01-02T18:00:00" }),
      episode("3", { release_date: "2022-01-03T08:00:00" }),
      episode("4", { release_date: "not-a-date" }),
    ];

    expect(
      createFolgenQuery(folgen)
        .dateRange({ endDate: "2022-01-02", startDate: "2022-01-01" })
        .results(),
    ).toEqual([folgen[0], folgen[1]]);
    expect(
      createFolgenQuery(folgen)
        .dateRange({ endDate: "2022-01-02", startDate: null })
        .results(),
    ).toEqual([folgen[0], folgen[1]]);
    expect(
      createFolgenQuery(folgen)
        .dateRange({ endDate: null, startDate: "2022-01-02" })
        .results(),
    ).toEqual([folgen[1], folgen[2]]);
    expect(
      createFolgenQuery(folgen)
        .dateRange({ endDate: null, startDate: null })
        .results(),
    ).toEqual(folgen);
  });

  it("applies special visibility only when configured", () => {
    const folgen = [episode("1"), episode("2", { type: "special" })];

    expect(createFolgenQuery(folgen).results()).toEqual(folgen);
    expect(createFolgenQuery(folgen).showSpecials(false).results()).toEqual([
      folgen[0],
    ]);
    expect(createFolgenQuery(folgen).showSpecials(true).results()).toEqual(
      folgen,
    );
  });

  it("sorts by every supported option, keeping ties stable and invalid dates last", () => {
    const tieA = episode("tie-a", {
      popularity: 7,
      rating: 4,
      release_date: "2022-01-02",
    });
    const old = episode("old", {
      popularity: 1,
      rating: 2,
      release_date: "2022-01-01",
    });
    const invalid = episode("invalid", {
      popularity: 7,
      rating: 5,
      release_date: "not-a-date",
    });
    const recent = episode("recent", {
      popularity: 3,
      rating: 1,
      release_date: "2022-01-03",
    });
    const tieB = episode("tie-b", {
      popularity: 7,
      rating: 4,
      release_date: "2022-01-02",
    });
    const folgen = [tieA, old, invalid, recent, tieB];

    expect(
      createFolgenQuery(folgen)
        .sort("dateAsc")
        .results()
        .map((folge) => folge._id),
    ).toEqual(["old", "tie-a", "tie-b", "recent", "invalid"]);
    expect(
      createFolgenQuery(folgen)
        .sort("dateDesc")
        .results()
        .map((folge) => folge._id),
    ).toEqual(["recent", "tie-a", "tie-b", "old", "invalid"]);
    expect(
      createFolgenQuery(folgen)
        .sort("popularity")
        .results()
        .map((folge) => folge._id),
    ).toEqual(["tie-a", "invalid", "tie-b", "recent", "old"]);
    expect(
      createFolgenQuery(folgen)
        .sort("rating")
        .results()
        .map((folge) => folge._id),
    ).toEqual(["invalid", "tie-a", "tie-b", "old", "recent"]);
  });

  it("combines filters and sorting without mutating the source or other query branches", () => {
    const special = episode("special", {
      name: "Road Special",
      release_date: "2022-01-02",
      type: "special",
    });
    const later = episode("later", {
      name: "Road West",
      release_date: "2022-01-03",
    });
    const earlier = episode("earlier", {
      name: "Road East",
      release_date: "2022-01-02",
    });
    const outsideRange = episode("outside", {
      name: "Road Far Away",
      release_date: "2021-12-31",
    });
    const unrelated = episode("unrelated", {
      name: "A Different Journey",
      release_date: "2022-01-04",
    });
    const folgen = [special, earlier, outsideRange, later, unrelated];
    const baseQuery = createFolgenQuery(folgen).search("road");

    const combined = baseQuery
      .dateRange({ endDate: "2022-01-03", startDate: "2022-01-01" })
      .showSpecials(false)
      .sort("dateDesc")
      .results();

    expect(combined).toEqual([later, earlier]);
    expect(baseQuery.results()).toEqual([
      special,
      earlier,
      outsideRange,
      later,
    ]);
    expect(folgen).toEqual([special, earlier, outsideRange, later, unrelated]);
  });

  it("operates only on the supplied collection subset", () => {
    const saved = [
      episode("saved-1", { name: "Saved Adventure" }),
      episode("saved-2", { name: "Saved Journey" }),
    ];
    const allFolgen = [...saved, episode("other", { name: "Other Adventure" })];

    expect(
      createFolgenQuery(saved)
        .search("adventure")
        .results()
        .map((folge) => folge._id),
    ).toEqual(["saved-1"]);
    expect(allFolgen).toHaveLength(3);
  });
});
