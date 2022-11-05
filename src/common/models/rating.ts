import mongoose from 'mongoose';
import * as z from 'zod';

import { MongoId } from '@/types';

const ratingValidator = z.object({
  user: z.instanceof(mongoose.Types.ObjectId),
  folge: z.instanceof(mongoose.Types.ObjectId),
  value: z.number().min(1).max(40),
  created_at: z.date(),
  updated_at: z.date(),
});

export type Rating = z.infer<typeof ratingValidator>;
export interface RatingWithId extends Rating {
  _id: MongoId;
}

const ratingSchema = new mongoose.Schema<Rating>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    folge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Folge',
      required: true,
    },
    value: {
      type: Number,
      min: 1,
      max: 10,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
    collection: 'ratings',
  },
);

const getModel = () => mongoose.model('Rating', ratingSchema);

export const Rating = (mongoose.models.Rating || getModel()) as ReturnType<
  typeof getModel
>;
