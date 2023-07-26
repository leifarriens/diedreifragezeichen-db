import { randomUUID } from 'crypto';

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
  apikey: authedProcedure.mutation(async ({ ctx }) => {
    const token = randomUUID();

    return Apikey.findOneAndUpdate(
      { user: ctx.user.id },
      { $set: { token } },
      { upsert: true, new: true },
    );
  }),
});
