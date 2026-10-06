import "server-only";
import type { RatingRepository } from "@ddfdb/user-api";

import { db, schema } from "@ddfdb/db";
import { and, eq, sql } from "drizzle-orm";

import {
  toCommunityRatingResponse,
  toRatingInsert,
  toRatingResponse,
} from "./rating.mapper";

const ratingResponseSelection = {
  folgeId: schema.rating.folgeId,
  score: schema.rating.score,
  updatedAt: schema.rating.updatedAt,
};

export const ratingRepository: RatingRepository = {
  async findAllFolgenCommunityRatings() {
    const ratings = await db
      .select({
        folgeId: schema.rating.folgeId,
        numberOfRatings: sql<number>`COUNT(*)`,
        score: sql<number>`AVG(${schema.rating.score})`,
      })
      .from(schema.rating)
      .groupBy(schema.rating.folgeId);

    return ratings.map(toCommunityRatingResponse);
  },

  async findAllUserRatings({ userId }) {
    const ratings = await db
      .select(ratingResponseSelection)
      .from(schema.rating)
      .where(eq(schema.rating.userId, userId));

    return ratings.map(toRatingResponse);
  },

  async findCommunityFolgenRating({ folgeId }) {
    const [rating] = await db
      .select({
        folgeId: schema.rating.folgeId,
        numberOfRatings: sql<number>`COUNT(*)`,
        score: sql<number>`AVG(${schema.rating.score})`,
      })
      .from(schema.rating)
      .where(eq(schema.rating.folgeId, folgeId))
      .groupBy(schema.rating.folgeId);

    return rating ? toCommunityRatingResponse(rating) : null;
  },

  async findUserFolgenRating({ folgeId, userId }) {
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

  async setRating({ folgeId, score, userId }) {
    const values = toRatingInsert({ folgeId, score, userId });
    const [rating] = await db
      .insert(schema.rating)
      .values(values)
      .onConflictDoUpdate({
        set: { score: values.score, updatedAt: new Date() },
        target: [schema.rating.userId, schema.rating.folgeId],
      })
      .returning(ratingResponseSelection);

    if (!rating) {
      throw new Error("Failed to save rating");
    }

    return toRatingResponse(rating);
  },
};
