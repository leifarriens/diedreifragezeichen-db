import { describe, expect, expectTypeOf, it } from "vitest";

import {
  enrichFolgenWithCommunityRatings,
  enrichFolgeWithCommunityRating,
  type FolgeWithCommunityRating,
} from "./index";

interface TestFolge {
  id: number;
  title: string;
}

const folgen: TestFolge[] = [
  { id: 1, title: "Erste Folge" },
  { id: 2, title: "Zweite Folge" },
];

describe("enrichFolgenWithCommunityRatings", () => {
  it("attaches matching ratings and projects away the rating Folge ID", () => {
    const result = enrichFolgenWithCommunityRatings(folgen, [
      { folgeId: 1, numberOfRatings: 3, score: 4.5 },
    ]);

    expect(result).toEqual([
      {
        ...folgen[0],
        communityRating: { numberOfRatings: 3, score: 4.5 },
      },
      { ...folgen[1], communityRating: null },
    ]);
    expectTypeOf(result).toEqualTypeOf<FolgeWithCommunityRating<TestFolge>[]>();
  });

  it("uses null when ratings are omitted", () => {
    expect(enrichFolgenWithCommunityRatings(folgen)).toEqual(
      folgen.map((folge) => ({ ...folge, communityRating: null })),
    );
  });

  it("returns a new array and preserves the input episodes", () => {
    const input = Object.freeze([
      Object.freeze({ extra: "preserved", id: 1, title: "Eine Folge" }),
    ]);
    const result = enrichFolgenWithCommunityRatings(input);

    expect(result).not.toBe(input);
    expect(result[0]).not.toBe(input[0]);
    expect(result[0]?.extra).toBe("preserved");
    expect(input[0]).toEqual({ extra: "preserved", id: 1, title: "Eine Folge" });
  });

  it("returns an empty array for empty input", () => {
    expect(
      enrichFolgenWithCommunityRatings(folgen.slice(0, 0), [
        { folgeId: 1, numberOfRatings: 3, score: 4.5 },
      ]),
    ).toEqual([]);
  });
});

describe("enrichFolgeWithCommunityRating", () => {
  it("enriches a single Folge with its rating summary", () => {
    const folge: TestFolge = { id: 1, title: "Eine Folge" };
    const communityRating = {
      folgeId: 1,
      numberOfRatings: 2,
      score: 4,
    };

    expect(enrichFolgeWithCommunityRating(folge, communityRating)).toEqual({
      ...folge,
      communityRating: { numberOfRatings: 2, score: 4 },
    });
  });

  it("sets the rating to null when no rating is available", () => {
    const folge: TestFolge = { id: 1, title: "Eine Folge" };

    expect(enrichFolgeWithCommunityRating(folge, null)).toEqual({
      ...folge,
      communityRating: null,
    });
  });
});
