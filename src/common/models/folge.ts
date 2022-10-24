import mongoose from 'mongoose';

import { FolgeType } from '@/types';

export interface Folge extends mongoose.Document {
  images: { url: string; height: number; width: number }[];
  name: string;
  number: string;
  type: FolgeType;
  rating: number;
  number_of_ratings: number;
  popularity: number;
  user_rating?: number;
  inhalt?: string;
  release_date: Date;
  spotify_id: string;
  deezer_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface FolgeWithId extends Folge {
  _id: mongoose.Types.ObjectId | string;
}

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

folgeSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
});

const getModel = () => mongoose.model('Folge', folgeSchema);

export const Folge = (mongoose.models.Folge || getModel()) as ReturnType<
  typeof getModel
>;
