import type { schema } from "@ddfdb/db";
import type { CommunityRating, Rating } from "@ddfdb/user-api";

type CommunityRatingSelectRow = Pick<RatingSelect, "folgeId"> & {
  numberOfRatings: number;
  popularity: number;
  score: number;
  updatedAt: Date | null; // updatedAt is calculated using MAX() and it is nullable in SQL.
};
type RatingInsert = typeof schema.rating.$inferInsert;

type RatingInsertInput = Pick<Rating, "score"> &
  Pick<RatingInsert, "folgeId" | "userId">;
type RatingInsertValues = Pick<RatingInsert, "folgeId" | "score" | "userId">;
type RatingSelect = typeof schema.rating.$inferSelect;
type RatingSelectRow = Pick<RatingSelect, "folgeId" | "score" | "updatedAt">;

export function toCommunityRatingResponse({
  folgeId,
  numberOfRatings,
  popularity,
  score,
  updatedAt,
}: CommunityRatingSelectRow): CommunityRating {
  if (updatedAt === null) {
    throw new Error("Expected a rating group to have an updatedAt");
  }

  return {
    folgeId,
    numberOfRatings,
    popularity,
    score: score / 2,
    updatedAt: updatedAt.toISOString(),
  };
}

export function toUserRatingInsert({
  folgeId,
  score,
  userId,
}: RatingInsertInput): RatingInsertValues {
  return { folgeId, score: score * 2, userId };
}

export function toUserRatingResponse({
  folgeId,
  score,
  updatedAt,
}: RatingSelectRow): Rating {
  return { folgeId, score: score / 2, updatedAt: updatedAt.toISOString() };
}
