import { describe, expect, it } from "vitest";

import { sortUserRatedFolgen } from "./user-rated-folgen-sort";

const folgen = [
  {
    id: 1,
    title: "First",
    userRating: 6,
    userRatingUpdatedAt: "2025-01-01T00:00:00.000Z",
  },
  {
    id: 2,
    title: "Second",
    userRating: 1,
    userRatingUpdatedAt: "2025-01-03T00:00:00.000Z",
  },
  {
    id: 3,
    title: "Third",
    userRating: 4,
    userRatingUpdatedAt: "2025-01-02T00:00:00.000Z",
  },
];

describe("sortUserRatedFolgen", () => {
  it("sorts from the worst rating to the best rating", () => {
    expect(
      sortUserRatedFolgen(folgen, "worst").map((folge) => folge.id),
    ).toEqual([2, 3, 1]);
  });

  it("sorts from the best rating to the worst rating", () => {
    expect(
      sortUserRatedFolgen(folgen, "best").map((folge) => folge.id),
    ).toEqual([1, 3, 2]);
  });

  it("sorts by most recent rating date first without mutating the input", () => {
    expect(
      sortUserRatedFolgen(folgen, "recent").map((folge) => folge.id),
    ).toEqual([2, 3, 1]);
    expect(folgen.map((folge) => folge.id)).toEqual([1, 2, 3]);
  });
});
