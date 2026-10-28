import { describe, expect, expectTypeOf, it } from "vitest";

import { enrichFolgenWithUserData, type FolgeUserData } from "./index";

interface TestFolge {
  id: number;
  title: string;
}

const folgen: TestFolge[] = [
  { id: 1, title: "Erste Folge" },
  { id: 2, title: "Zweite Folge" },
];

describe("enrichFolgenWithUserData", () => {
  it("attaches matching bookmark, listening, and rating data", () => {
    const result = enrichFolgenWithUserData(folgen, {
      bookmarks: [{ createdAt: "2025-01-01T10:00:00.000Z", folgeId: 1 }],
      listened: [{ createdAt: "2025-02-01T10:00:00.000Z", folgeId: 1 }],
      ratings: [
        { folgeId: 1, score: 4.5, updatedAt: "2025-03-01T10:00:00.000Z" },
      ],
    });

    expect(result).toEqual([
      {
        ...folgen[0],
        bookmarkedAt: "2025-01-01T10:00:00.000Z",
        hasListened: true,
        isBookmarked: true,
        listenedAt: "2025-02-01T10:00:00.000Z",
        userRating: 4.5,
        userRatingUpdatedAt: "2025-03-01T10:00:00.000Z",
      },
      {
        ...folgen[1],
        bookmarkedAt: null,
        hasListened: false,
        isBookmarked: false,
        listenedAt: null,
        userRating: null,
        userRatingUpdatedAt: null,
      },
    ]);
  });

  it("uses empty user data by default", () => {
    expect(enrichFolgenWithUserData(folgen)).toEqual(
      folgen.map((folge) => ({
        ...folge,
        bookmarkedAt: null,
        hasListened: false,
        isBookmarked: false,
        listenedAt: null,
        userRating: null,
        userRatingUpdatedAt: null,
      })),
    );
  });

  it("returns a new array and preserves the input episodes", () => {
    const input = Object.freeze([
      Object.freeze({ extra: "preserved", id: 1, title: "Eine Folge" }),
    ]);
    const result = enrichFolgenWithUserData(input);

    expect(result).not.toBe(input);
    expect(result[0]).not.toBe(input[0]);
    expect(result[0]?.extra).toBe("preserved");
    expect(input[0]).toEqual({
      extra: "preserved",
      id: 1,
      title: "Eine Folge",
    });
    expectTypeOf(result).toEqualTypeOf<
      ((typeof input)[number] & FolgeUserData)[]
    >();
  });

  it("returns an empty array for empty input", () => {
    expect(enrichFolgenWithUserData([])).toEqual([]);
  });
});
