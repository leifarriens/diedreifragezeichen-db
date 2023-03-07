import { syncDeezer, syncFolgen, syncInhalte } from '@/services/syncFolgen';

import { adminProcedure, router } from '../trpc';

export const syncRouter = router({
  folgen: adminProcedure.mutation(async () => {
    const result = await syncFolgen();

    return result;
  }),
  inhalte: adminProcedure.mutation(async () => {
    const result = await syncInhalte();

    return result;
  }),
  deezer: adminProcedure.mutation(async () => {
    const result = await syncDeezer();

    return result;
  }),
});
