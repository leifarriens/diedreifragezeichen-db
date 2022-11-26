import { inferAsyncReturnType } from '@trpc/server';
import type { CreateNextContextOptions } from '@trpc/server/adapters/next';

import dbConnect from '@/db/connect';
import { getServerSession } from '@/lib/getServerSession';

export const createContext = async ({ req, res }: CreateNextContextOptions) => {
  await dbConnect();

  const session = await getServerSession(req, res);

  return {
    session,
  };
};

export type Context = inferAsyncReturnType<typeof createContext>;
