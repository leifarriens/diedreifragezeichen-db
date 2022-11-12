import mongoose from 'mongoose';
import * as z from 'zod';

import { MongoId, SchemaType } from '@/types';

import { folgeValidator, Image, Type } from './folge.validator';

export type Type = z.infer<typeof Type>;
export type Image = z.infer<typeof Image>;

export type Folge = z.infer<typeof folgeValidator>;

type FolgeSchema = SchemaType<Folge>;

export type FolgeWithId = Folge & {
  _id: MongoId;
};

const folgeSchema = new mongoose.Schema<FolgeSchema>(
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
