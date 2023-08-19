import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import type { FolgeWithId } from '@/models/folge';
import { User } from '@/models/user';

import { authedProcedure, router } from '../trpc';

export const listRouter = router({
  /**
   * Gets all ids of Folgen in user list
   */
  all: authedProcedure.query(async ({ ctx }) => {
    const user = await User.findById(ctx.session?.user.id).lean();

    if (!user?.list) {
      throw new TRPCError({ code: 'NOT_FOUND' });
    }

    return user.list.map((id) => id.toString());
  }),
  /**
   * Gets all Folgen in user list
   */
  allFolgen: authedProcedure
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
        items: list.reverse(),
        limit,
        offset,
        total,
      };
    }),
  /**
   * Add folge to user list
   */
  add: authedProcedure
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
  /**
   * Remove folge from user list
   */
  remove: authedProcedure
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
});
