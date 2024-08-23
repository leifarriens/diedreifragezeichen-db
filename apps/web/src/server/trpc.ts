import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';

import type { Context } from './context';

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const middleware = t.middleware;
export const router = t.router;
export const publicProcedure = t.procedure;

const isAuthed = middleware(({ ctx, next }) => {
  const user = ctx.session?.user;

  if (!user?.id) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  return next({
    ctx: {
      user: {
        ...user,
        id: user.id,
      },
    },
  });
});

export const authedProcedure = t.procedure.use(isAuthed);

export const adminProcedure = t.procedure.use(isAuthed).use(({ ctx, next }) => {
  if (ctx.user.role !== 'Admin') {
    throw new TRPCError({ code: 'FORBIDDEN' });
  }

  return next();
});
