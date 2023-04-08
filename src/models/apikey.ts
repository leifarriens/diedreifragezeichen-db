// NOTE: Models referenced in schema should be imported
import '@/models/user';

import mongoose from 'mongoose';
import { z } from 'zod';

import type { SchemaType } from '@/types';

export const apikeyValidator = z.object({
  user: z.instanceof(mongoose.Types.ObjectId).or(z.string()),
  token: z.string().uuid(),
  created_at: z.date(),
  updated_at: z.date(),
});

export type Apikey = z.infer<typeof apikeyValidator>;

const apikeySchema = new mongoose.Schema<SchemaType<Apikey>>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    token: { type: String, required: true },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
    collection: 'apikeys',
  },
);

const getModel = () => mongoose.model('Apikey', apikeySchema);

// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
export const Apikey = (mongoose.models.Apikey || getModel()) as ReturnType<
  typeof getModel
>;
