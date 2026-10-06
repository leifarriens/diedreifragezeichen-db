import "server-only";
import type { Rating, RatingRepository } from "@ddfdb/user-api";

import { db, schema } from "@ddfdb/db";
import { and, eq, sql } from "drizzle-orm";

const ratingResponseSelection = {
  folgeId: schema.rating.folgeId,
  score: schema.rating.score,
  updatedAt: schema.rating.updatedAt,
};

type RatingRow = Pick<
  typeof schema.rating.$inferSelect,
  "folgeId" | "score" | "updatedAt"
>;

export const ratingRepository: RatingRepository = {
  async getCommunityRatingForFolge({ folgeId }) {
    const [rating] = await db
      .select({
        folgeId: schema.rating.folgeId,
        numberOfRatings: sql<number>`COUNT(*)`,
        score: sql<number>`AVG(${schema.rating.score})`,
      })
      .from(schema.rating)
      .where(eq(schema.rating.folgeId, folgeId))
      .groupBy(schema.rating.folgeId);

    return rating ?? null;
  },

  async getRating({ folgeId, userId }) {
    const [rating] = await db
      .select(ratingResponseSelection)
      .from(schema.rating)
      .where(
        and(
          eq(schema.rating.userId, userId),
          eq(schema.rating.folgeId, folgeId),
        ),
      )
      .limit(1);

    return rating ? toRatingResponse(rating) : null;
  },

  async getRatingsForUser({ userId }) {
    const ratings = await db
      .select(ratingResponseSelection)
      .from(schema.rating)
      .where(eq(schema.rating.userId, userId));

    return ratings.map(toRatingResponse);
  },

  async removeRating({ folgeId, userId }) {
    await db
      .delete(schema.rating)
      .where(
        and(
          eq(schema.rating.userId, userId),
          eq(schema.rating.folgeId, folgeId),
        ),
      );
  },

  async setRating({ folgeId, score, userId }): Promise<Rating> {
    const [rating] = await db
      .insert(schema.rating)
      .values({ folgeId, score, userId })
      .onConflictDoUpdate({
        set: { score, updatedAt: new Date() },
        target: [schema.rating.userId, schema.rating.folgeId],
      })
      .returning(ratingResponseSelection);

    if (!rating) {
      throw new Error("Failed to save rating");
    }

    return toRatingResponse(rating);
  },
};

function toRatingResponse({ updatedAt, ...rest }: RatingRow): Rating {
  return { ...rest, updatedAt: updatedAt.toISOString() };
}
