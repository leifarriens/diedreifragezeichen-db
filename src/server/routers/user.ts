import { randomUUID } from 'crypto';
import { z } from 'zod';

import { Apikey } from '@/models/apikey';
import { User } from '@/models/user';
import { deleteUser } from '@/services/user.service';

import { authedProcedure, router } from '../trpc';

export const userRouter = router({
  self: authedProcedure.query(async ({ ctx }) => {
    const user = await User.findById(ctx.session?.user.id).lean();

    return user;
  }),
  delete: authedProcedure.mutation(async ({ ctx }) => {
    return deleteUser(ctx.user.id);
  }),
  createApikey: authedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const token = randomUUID();

      const key = await Apikey.create({
        user: ctx.user.id,
        token,
        name: input.name,
      });

      return key;
    }),
  apikeys: authedProcedure.query(async ({ ctx }) => {
    const keys = await Apikey.find({ user: ctx.user.id }).lean();

    return keys.map((key) => ({
      ...key,
      // token: key.token.slice(0, 6) + String('*').repeat(key.token.length - 6),
      token:
        key.token.slice(0, 3) +
        String('.').repeat(3) +
        key.token.slice(key.token.length - 4, key.token.length),
    }));
  }),
  deleteApikey: authedProcedure
    .input(z.object({ keyId: z.string() }))
    .mutation(async ({ input }) => {
      await Apikey.findByIdAndDelete(input.keyId);
    }),
});
