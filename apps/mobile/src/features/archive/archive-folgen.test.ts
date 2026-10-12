import { describe, expect, it } from "vitest";

import { filterArchiveFolgen, sortArchiveFolgen } from "./archive-folgen";

const folgen = [
  {
    collection: "serie",
    communityRating: { popularity: 10, score: 4, votes: 2 },
    id: 1,
    number: 1,
    release_date: "1990-04-10",
    title: "Older Folge",
  },
  {
    collection: "serie",
    communityRating: { popularity: 25, score: 5, votes: 3 },
    id: 2,
    number: 2,
    release_date: "2000-08-12",
    title: "Newer Folge",
  },
  {
    collection: "spezial",
    communityRating: null,
    id: 3,
    number: null,
    release_date: "1995-06-21",
    title: "Special Folge",
  },
  {
    collection: "serie",
    communityRating: { popularity: 0, score: 0, votes: 0 },
    id: 4,
    number: 4,
    release_date: null,
    title: "Undated Folge",
  },
];

describe("archive Folgen", () => {
  it("filters inclusively by the selected release years", () => {
    expect(
      filterArchiveFolgen(folgen, "", {
        endDate: "1999-01-01",
        showSpecials: true,
        startDate: "1990-12-31",
      }).map(({ id }) => id),
    ).toEqual([1, 3]);
  });

  it("keeps undated episodes when no year range is selected", () => {
    expect(
      filterArchiveFolgen(folgen, "", {
        endDate: null,
        showSpecials: false,
        startDate: null,
      }).map(({ id }) => id),
    ).toEqual([1, 2, 4]);
  });

  it("sorts by release date, community rating and popularity", () => {
    expect(sortArchiveFolgen(folgen, "newest").map(({ id }) => id)).toEqual([
      2, 3, 1, 4,
    ]);
    expect(sortArchiveFolgen(folgen, "oldest").map(({ id }) => id)).toEqual([
      1, 3, 2, 4,
    ]);
    expect(sortArchiveFolgen(folgen, "rating").map(({ id }) => id)).toEqual([
      2, 1, 4, 3,
    ]);
    expect(sortArchiveFolgen(folgen, "popularity").map(({ id }) => id)).toEqual(
      [2, 1, 4, 3],
    );
  });
});
