import mongoose from 'mongoose';

import type { Folge } from '@/models/folge';

export type FolgeType = 'regular' | 'special';

export interface RatingWithFolge {
  _id: string;
  createdAt: Date;
  user: string;
  value: number;
  updatedAt: Date;
  folge: Folge;
}

export type SpotifyAlbum = {
  id: string;
  name: string;
  images: {
    url: string;
    height: number;
    width: number;
  }[];
  release_date: Date;
  artists: unknown;
};

export type YearRange = {
  min: Date;
  max: Date;
};

export type MongoId = mongoose.Types.ObjectId | string;
