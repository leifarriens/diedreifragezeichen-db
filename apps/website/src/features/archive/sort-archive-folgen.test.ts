import type { FolgeWithCommunityRating } from "@ddfdb/core";

import { describe, expect, it } from "vitest";

import { sortArchiveFolgen } from "./sort-archive-folgen";

function makeFolge(
  id: number,
  score: null | number,
  releaseDate: string,
): FolgeWithCommunityRating {
  return {
    artwork: null,
    authors: [],
    collection: "serie",
    communityRating: score === null ? null : { numberOfRatings: 1, score },
    cover: null,
    description: null,
    id,
    number: id,
    release_date: releaseDate,
    script_authors: [],
    streaming: {},
    title: `Folge ${String(id)}`,
    total_duration: null,
    voice_roles: [],
    weblink: null,
  };
}

const folgen = [
  makeFolge(1, 2, "1980-01-01"),
  makeFolge(2, 3, "2000-01-01"),
  makeFolge(3, null, "2010-01-01"),
  makeFolge(4, 3, "1990-01-01"),
];

describe("archive Folge sorting", () => {
  it("sorts community ratings from best to worst, with unrated Folgen last", () => {
    expect(sortArchiveFolgen(folgen, "rating").map(({ id }) => id)).toEqual([
      2, 4, 1, 3,
    ]);
  });

  it("does not mutate the input array", () => {
    const input = [...folgen];

    sortArchiveFolgen(input, "rating");

    expect(input).toEqual(folgen);
  });

  it("keeps release date sorting behavior", () => {
    expect(sortArchiveFolgen(folgen, "newest").map(({ id }) => id)).toEqual([
      3, 2, 4, 1,
    ]);
    expect(sortArchiveFolgen(folgen, "oldest").map(({ id }) => id)).toEqual([
      1, 4, 2, 3,
    ]);
  });
});
