import type { SortOrder } from 'mongoose';
import { z } from 'zod';

import { RatingsSortOptions } from '@/constants/enums';
import type { FolgeWithId } from '@/models/folge';
import { Rating, ratingValidator } from '@/models/rating';
import {
  deleteFolgenRating,
  getUserRatings,
  postFolgenRating,
} from '@/services/rating.service';

import { authedProcedure, router } from '../trpc';

export const ratingRouter = router({
  /**
   * Add a user rating
   */
  add: authedProcedure
    .input(
      z
        .object({
          folgeId: z.string(),
        })
        .merge(ratingValidator.pick({ value: true })),
    )
    .mutation(async ({ ctx, input: { folgeId, value } }) => {
      const rating = await postFolgenRating({
        folgeId,
        userId: ctx.user.id,
        userRating: value,
      });

      return rating.value;
    }),
  /**
   * Revoke a user rating
   */
  revoke: authedProcedure
    .input(
      z.object({
        folgeId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return deleteFolgenRating({
        folgeId: input.folgeId,
        userId: ctx.user.id,
      });
    }),
  /**
   * Get all user ratings
   */
  userRatings: authedProcedure.query(async ({ ctx }) => {
    const ratings = await getUserRatings(ctx.user.id, {
      fields: ['-_id', 'folge', 'value'],
    });

    return ratings;
  }),
  /**
   * Get all user ratings with folge
   */
  userRatingsWithFolgen: authedProcedure
    .input(
      z.object({
        sort: RatingsSortOptions,
        limit: z.number().int().min(1).max(50).default(20),
        cursor: z.number().default(0),
      }),
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit;
      const offset = input.cursor;

      const filter = { user: ctx.user.id };

      const total = await Rating.countDocuments(filter);

      const sort: Record<string, SortOrder> = { [input.sort]: -1 };

      const ratings = await Rating.find(filter)
        .sort(sort)
        .limit(limit)
        .skip(offset)
        .populate<{ folge: FolgeWithId }>({ path: 'folge' })
        .lean();

      return {
        items: ratings,
        limit,
        offset,
        total,
      };
    }),
});
