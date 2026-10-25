import "server-only";
import type { RatingRepository } from "@ddfdb/user-api";

import { db, schema } from "@ddfdb/db";
import { and, avg, count, desc, eq, max, sum } from "drizzle-orm";

import {
  toCommunityRatingResponse,
  toUserRatingInsert,
  toUserRatingResponse,
} from "./rating.mapper";

const ratingResponseSelection = {
  folgeId: schema.rating.folgeId,
  score: schema.rating.score,
  updatedAt: schema.rating.updatedAt,
};

const numberOfRatings = count();
const popularity = sum(schema.rating.score).mapWith(Number);
const score = avg(schema.rating.score).mapWith(Number);

export const ratingRepository: RatingRepository = {
  async deleteUserRating({ folgeId, userId }) {
    await db
      .delete(schema.rating)
      .where(
        and(
          eq(schema.rating.userId, userId),
          eq(schema.rating.folgeId, folgeId),
        ),
      );
  },

  async findAllFolgenCommunityRatings() {
    const ratings = await db
      .select({
        folgeId: schema.rating.folgeId,
        numberOfRatings,
        popularity,
        score,
        updatedAt: max(schema.rating.updatedAt),
      })
      .from(schema.rating)
      .groupBy(schema.rating.folgeId);

    return ratings.map(toCommunityRatingResponse);
  },

  /**
   * Finds all ratings made by a specific user, ordered by the most recent update.
   */
  async findUserRatingsByUserId({ userId }) {
    const ratings = await db
      .select(ratingResponseSelection)
      .from(schema.rating)
      .where(eq(schema.rating.userId, userId))
      .orderBy(desc(schema.rating.updatedAt));

    return ratings.map(toUserRatingResponse);
  },

  async upsertUserRating({ folgeId, score, userId }) {
    const values = toUserRatingInsert({ folgeId, score, userId });
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

    return toUserRatingResponse(rating);
  },
};
