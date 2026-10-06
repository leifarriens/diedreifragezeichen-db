import { describe, expect, it } from "vitest";

import {
  toCommunityRatingResponse,
  toRatingInsert,
  toRatingResponse,
} from "./rating.mapper";

describe("rating mappers", () => {
  it("maps API ratings to integer database scores", () => {
    expect(
      toRatingInsert({ folgeId: 42, score: 2.5, userId: "user-1" }),
    ).toEqual({ folgeId: 42, score: 5, userId: "user-1" });
  });

  it("maps selected database ratings to API responses", () => {
    expect(
      toRatingResponse({
        folgeId: 42,
        score: 5,
        updatedAt: new Date("2025-01-01T12:00:00.000Z"),
      }),
    ).toEqual({
      folgeId: 42,
      score: 2.5,
      updatedAt: "2025-01-01T12:00:00.000Z",
    });
  });

  it("maps aggregate database scores to community ratings", () => {
    expect(
      toCommunityRatingResponse({
        folgeId: 42,
        numberOfRatings: 4,
        score: 3,
      }),
    ).toEqual({ folgeId: 42, numberOfRatings: 4, score: 1.5 });
  });
});
