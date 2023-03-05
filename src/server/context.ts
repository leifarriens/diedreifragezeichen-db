import { inferAsyncReturnType } from '@trpc/server';
import type { CreateNextContextOptions } from '@trpc/server/adapters/next';

import dbConnect from '@/db/connect';
import { getServerAuthSesion } from '@/lib/getServerAuthSesion';

export const createContext = async ({ req, res }: CreateNextContextOptions) => {
  await dbConnect();

  const session = await getServerAuthSesion(req, res);

  return {
    session,
  };
};

export type Context = inferAsyncReturnType<typeof createContext>;
