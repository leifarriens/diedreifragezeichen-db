import type { schema } from "@ddfdb/db";
import type { CommunityRating, Rating } from "@ddfdb/user-api";

type CommunityRatingSelectRow = Pick<RatingSelect, "folgeId"> & {
  numberOfRatings: number;
  score: number;
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
  score,
}: CommunityRatingSelectRow): CommunityRating {
  return { folgeId, numberOfRatings, score: score / 2 };
}

export function toRatingInsert({
  folgeId,
  score,
  userId,
}: RatingInsertInput): RatingInsertValues {
  return { folgeId, score: score * 2, userId };
}

export function toRatingResponse({
  folgeId,
  score,
  updatedAt,
}: RatingSelectRow): Rating {
  return { folgeId, score: score / 2, updatedAt: updatedAt.toISOString() };
}
