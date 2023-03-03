import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { Folge } from '@/common/models/folge';
import { folgeValidator } from '@/models/folge/folge.validator';
import { ratingValidator } from '@/models/rating';
import {
  deleteFolge,
  getFolge,
  getRelatedFolgen,
  updateFolge,
} from '@/services/folge.service';
import { postFolgenRating } from '@/services/rating.service';
import syncFolgen from '@/services/syncFolgen';

import {
  adminProcedure,
  authedProcedure,
  publicProcedure,
  router,
} from '../trpc';

export const folgeRouter = router({
  search: publicProcedure
    .input(
      z.object({
        query: z.string(),
        limit: z.number().default(5),
        cursor: z.number().default(0),
      }),
    )
    .query(async ({ input }) => {
      const limit = input.limit;
      const offset = input.cursor;

      const query = { name: { $regex: input.query, $options: 'i' } };
      const folgen = await Folge.find(query)
        .limit(limit)
        .skip(offset)
        .select('name images')
        .lean();

      const total = await Folge.countDocuments(query);

      return {
        items: folgen,
        limit,
        offset,
        total,
      };
    }),
  all: adminProcedure
    .input(
      z.object({
        query: z.string(),
        specials: z.boolean().default(true),
        cursor: z.number().default(0),
      }),
    )
    .query(async ({ input }) => {
      const limit = 40;
      const offset = input.cursor;
      const type = !input.specials ? 'regular' : null;

      const query = {
        name: { $regex: input.query, $options: 'i' },
        ...(type && { type }),
      };

      const folgen = await Folge.find(query)
        .limit(limit)
        .skip(offset)
        .sort('-release_date')
        .lean();

      const total = await Folge.countDocuments(query);

      return {
        items: folgen,
        limit,
        offset,
        total,
      };
    }),
  byId: publicProcedure
    .input(
      z.object({
        id: z.string().length(24),
      }),
    )
    .query(async ({ input }) => {
      const folge = await getFolge(input.id);

      if (!folge) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      return folge;
    }),
  related: publicProcedure
    .input(z.object({ folgeId: z.string() }))
    .query(async ({ input }) => {
      const folgen = await getRelatedFolgen(input.folgeId, {
        fields: ['images', 'name', 'rating', 'number_of_ratings'],
      });

      return folgen;
    }),
  addRating: authedProcedure
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
  update: adminProcedure
    .input(
      z.object({
        folgeId: z.string(),
        update: folgeValidator.partial(),
      }),
    )
    .mutation(async ({ input: { folgeId, update } }) => {
      const folge = await updateFolge(folgeId, update);

      return folge;
    }),
  delete: adminProcedure
    .input(z.object({ folgeId: z.string() }))
    .mutation(async ({ input }) => {
      return deleteFolge(input.folgeId);
    }),
  sync: adminProcedure.mutation(async () => {
    const result = await syncFolgen();
    console.log(result);
    return result;
  }),
});
