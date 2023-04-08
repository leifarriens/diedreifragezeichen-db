import { TRPCError } from '@trpc/server';
import { randomUUID } from 'crypto';
import { z } from 'zod';

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
  list: authedProcedure.query(async ({ ctx }) => {
    const user = await User.findById(ctx.session?.user.id).lean();

    if (!user?.list) {
      throw new TRPCError({ code: 'NOT_FOUND' });
    }

    return user.list.map((id) => id.toString());
  }),
  listWithFolgen: authedProcedure
    .input(
      z.object({
        limit: z.number().int().min(1).max(50).default(20),
        cursor: z.number().default(0),
      }),
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit;
      const offset = input.cursor;

      const user = await User.findById(ctx.session?.user.id).select('list');

      if (!user?.list) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      const total = user.list.length;

      const { list } = await user.populate<{ list: FolgeWithId[] }>({
        path: 'list',
        options: { limit, skip: offset },
      });

      return {
        items: list,
        limit,
        offset,
        total,
      };
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
        limit: z.number().int().min(1).max(50).default(20),
        cursor: z.number().default(0),
      }),
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit;
      const offset = input.cursor;

      const filter = { user: ctx.user.id };

      const total = await Rating.count(filter);

      const ratings = await Rating.find(filter)
        .sort('-updated_at')
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
  addToList: authedProcedure
    .input(
      z.object({
        folgeId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return User.updateOne(
        { _id: ctx.user.id },
        {
          $addToSet: { list: input.folgeId },
        },
      );
    }),
  removeFromList: authedProcedure
    .input(
      z.object({
        folgeId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return User.updateOne(
        { _id: ctx.user.id },
        {
          $pull: { list: input.folgeId },
        },
      );
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
