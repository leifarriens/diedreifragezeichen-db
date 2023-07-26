import { randomUUID } from 'crypto';
import type { SortOrder } from 'mongoose';
import { z } from 'zod';

import { RatingsSortOptions } from '@/constants/enums';
import { Apikey } from '@/models/apikey';
import type { FolgeWithId } from '@/models/folge';
import { Rating } from '@/models/rating';
import { User } from '@/models/user';
import { getUserRatings } from '@/services/rating.service';
import { deleteUser } from '@/services/user.service';

import { authedProcedure, router } from '../trpc';

export const userRouter = router({
  self: authedProcedure.query(async ({ ctx }) => {
    const user = await User.findById(ctx.session?.user.id).lean();

    return user;
  }),
  ratings: authedProcedure.query(async ({ ctx }) => {
    const ratings = await getUserRatings(ctx.user.id, {
      fields: ['-_id', 'folge', 'value'],
    });

    return ratings;
  }),
  ratedFolgen: authedProcedure
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
  delete: authedProcedure.mutation(async ({ ctx }) => {
    return deleteUser(ctx.user.id);
  }),
  apikey: authedProcedure.mutation(async ({ ctx }) => {
    const token = randomUUID();

    return Apikey.findOneAndUpdate(
      { user: ctx.user.id },
      { $set: { token } },
      { upsert: true, new: true },
    );
  }),
});
