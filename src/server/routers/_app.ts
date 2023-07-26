import { router } from '../trpc';
import { folgeRouter } from './folge';
import { listRouter } from './list';
import { ratingRouter } from './rating';
import { syncRouter } from './sync';
import { userRouter } from './user';

export const appRouter = router({
  folge: folgeRouter,
  list: listRouter,
  user: userRouter,
  rating: ratingRouter,
  sync: syncRouter,
});

export type AppRouter = typeof appRouter;
