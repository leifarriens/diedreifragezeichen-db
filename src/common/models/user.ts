import mongoose from 'mongoose';
import * as z from 'zod';

import { MongoId } from '@/types';

const Role = z.enum(['User', 'Admin']);

export type Role = z.infer<typeof Role>;

const userValidator = z.object({
  name: z.string(),
  email: z.string().email(),
  image: z.string().nullable(),
  emailVerified: z.boolean(),
  role: Role,
  list: z.array(z.instanceof(mongoose.Types.ObjectId)),
});

export type User = z.infer<typeof userValidator>;

export interface UserWithId extends User {
  _id: MongoId;
}

const userSchema = new mongoose.Schema<User>(
  {
    name: String,
    email: String,
    image: String,
    emailVerified: Boolean,
    role: { type: String, default: 'User' },
    list: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Folge',
      },
    ],
  },
  {
    timestamps: true,
    collection: 'users',
  },
);

const getModel = () => mongoose.model('User', userSchema);

export const User = (mongoose.models.User || getModel()) as ReturnType<
  typeof getModel
>;
