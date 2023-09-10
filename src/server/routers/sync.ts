import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import {
  syncDeezer,
  syncDetails,
  syncFolgen,
  syncFolgenDetails,
  syncWeblinks,
} from '@/services/sync.service';

import { adminProcedure, router } from '../trpc';

export const syncRouter = router({
  folgen: adminProcedure.mutation(async () => {
    const result = await syncFolgen();

    return result;
  }),
  deezer: adminProcedure.mutation(async () => {
    const result = await syncDeezer();

    return result;
  }),
  weblink: adminProcedure.mutation(async () => {
    const result = await syncWeblinks();

    return result;
  }),
  details: adminProcedure.mutation(async () => {
    const result = await syncDetails();

    return result;
  }),
  folgeDetails: adminProcedure
    .input(
      z.object({
        folgeId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const result = await syncFolgenDetails(input.folgeId);

      if (!result) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'No result from sync service',
        });
      }

      return result;
    }),
});
