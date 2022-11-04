import mongoose from 'mongoose';
import * as z from 'zod';

import { MongoId } from '@/types';

const Type = z.enum(['regular', 'special']);

const Image = z.object({
  url: z.string(),
  height: z.number(),
  width: z.number(),
});

export type Type = z.infer<typeof Type>;

const folgeValidator = z.object({
  name: z.string(),
  number: z.string(),
  type: Type,
  images: z.array(Image),
  rating: z.number().min(1).max(10),
  number_of_ratings: z.number().int(),
  popularity: z.number(),
  user_rating: z.number().optional(),
  inhalt: z.string(),
  release_date: z.date(),
  spotify_id: z.string(),
  deezer_id: z.string(),
  created_at: z.date(),
  updated_at: z.date(),
});

export type Folge = z.infer<typeof folgeValidator>;

export type FolgeWithId = Folge & {
  _id: MongoId;
};

const folgeSchema = new mongoose.Schema<Folge>(
  {
    images: Array,
    name: String,
    number: String,
    type: String,
    rating: { type: Number, default: 0 },
    number_of_ratings: { type: Number, default: 0 },
    popularity: { type: Number, default: 0 },
    inhalt: String,
    release_date: Date,
    spotify_id: String,
    deezer_id: String,
  },
  {
    collection: 'folgen',
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);

const getModel = () => mongoose.model('Folge', folgeSchema);

export const Folge = (mongoose.models.Folge || getModel()) as ReturnType<
  typeof getModel
>;
