import { TRPCError } from '@trpc/server';
import { z } from 'zod';

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
  listWithFolgen: authedProcedure.query(async ({ ctx }) => {
    const user = await User.findById(ctx.session?.user.id)
      .populate<{ list: FolgeWithId[] }>({ path: 'list' })
      .lean();

    if (!user?.list) {
      throw new TRPCError({ code: 'NOT_FOUND' });
    }

    return user.list;
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
        limit: z.number().int().min(1).max(50).nullish(),
        cursor: z.number().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 20;
      const offset = input.cursor ?? 0;

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
});
