import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { folgeValidator } from '@/models/folge/folge.validator';
import { ratingValidator } from '@/models/rating';
import {
  deleteFolge,
  getFolge,
  getFolgen,
  getRelatedFolgen,
  updateFolge,
} from '@/services/folge.service';
import { postFolgenRating } from '@/services/rating.service';

import {
  adminProcedure,
  authedProcedure,
  publicProcedure,
  router,
} from '../trpc';

export const folgeRouter = router({
  all: publicProcedure.query(async () => {
    const folgen = await getFolgen();

    return folgen;
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
});
