import { describe, expect, it } from "vitest";

import type { Folge } from "../../api/types";

import { createFolgenQuery } from "./query";

function episode(id: number, overrides: Partial<Folge> = {}): Folge {
  return {
    artwork: null,
    collection: "serie",
    cover: null,
    description: null,
    id,
    links: {},
    number: id,
    release_date: "2022-01-01",
    title: `Episode ${String(id)}`,
    total_duration: null,
    weblink: null,
    ...overrides,
  };
}

describe("createFolgenQuery", () => {
  it("preserves input order and includes all Folgen when no operation is configured", () => {
    const folgen = [episode(2), episode(1)];
    const results = createFolgenQuery(folgen).results();

    expect(results).toEqual(folgen);
    expect(results).not.toBe(folgen);
    expect(createFolgenQuery(folgen).results()).not.toBe(results);
  });

  it("searches titles, numbers, and exact release years case-insensitively", () => {
    const folgen = [
      episode(1, { title: "Das große Abenteuer" }),
      episode(42, { title: "Ein ruhiger Tag" }),
      episode(3, { release_date: "2020-03-11" }),
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
      episode(1, { title: "Die [Sonderfolge]" }),
      episode(2, { title: "Ein Abenteuer" }),
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
      episode(1, { release_date: "2022-01-01T08:00:00" }),
      episode(2, { release_date: "2022-01-02T18:00:00" }),
      episode(3, { release_date: "2022-01-03T08:00:00" }),
      episode(4, { release_date: null }),
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

  it("filters specials by collection rather than inferring from number", () => {
    const numbered = episode(1);
    const special = episode(2, { collection: "spezial", number: null });
    const unnumberedSeries = episode(3, { number: null });
    const folgen = [numbered, special, unnumberedSeries];

    expect(createFolgenQuery(folgen).results()).toEqual(folgen);
    expect(createFolgenQuery(folgen).showSpecials(false).results()).toEqual([
      numbered,
      unnumberedSeries,
    ]);
    expect(createFolgenQuery(folgen).showSpecials(true).results()).toEqual(
      folgen,
    );
  });

  it("sorts by release date, keeping ties stable and invalid dates last", () => {
    const tieA = episode(1, { release_date: "2022-01-02" });
    const old = episode(2, { release_date: "2022-01-01" });
    const invalid = episode(3, { release_date: null });
    const recent = episode(4, { release_date: "2022-01-03" });
    const tieB = episode(5, { release_date: "2022-01-02" });
    const folgen = [tieA, old, invalid, recent, tieB];

    expect(
      createFolgenQuery(folgen)
        .sort("dateAsc")
        .results()
        .map((folge) => folge.id),
    ).toEqual([2, 1, 5, 4, 3]);
    expect(
      createFolgenQuery(folgen)
        .sort("dateDesc")
        .results()
        .map((folge) => folge.id),
    ).toEqual([4, 1, 5, 2, 3]);
  });

  it("combines filters and sorting without mutating the source or other query branches", () => {
    const special = episode(1, {
      collection: "spezial",
      number: null,
      release_date: "2022-01-02",
      title: "Road Special",
    });
    const later = episode(2, {
      release_date: "2022-01-03",
      title: "Road West",
    });
    const earlier = episode(3, {
      release_date: "2022-01-02",
      title: "Road East",
    });
    const outsideRange = episode(4, {
      release_date: "2021-12-31",
      title: "Road Far Away",
    });
    const unrelated = episode(5, {
      release_date: "2022-01-04",
      title: "A Different Journey",
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
      episode(1, { title: "Saved Adventure" }),
      episode(2, { title: "Saved Journey" }),
    ];
    const allFolgen = [...saved, episode(3, { title: "Other Adventure" })];

    expect(
      createFolgenQuery(saved)
        .search("adventure")
        .results()
        .map((folge) => folge.id),
    ).toEqual([1]);
    expect(allFolgen).toHaveLength(3);
  });
});
