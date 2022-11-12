import { router } from '../trpc';
import { folgeRouter } from './folge';
import { userRouter } from './user';

export const appRouter = router({
  folge: folgeRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
