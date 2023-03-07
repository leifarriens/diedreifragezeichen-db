import { router } from '../trpc';
import { folgeRouter } from './folge';
import { syncRouter } from './sync';
import { userRouter } from './user';

export const appRouter = router({
  folge: folgeRouter,
  user: userRouter,
  sync: syncRouter,
});

export type AppRouter = typeof appRouter;
