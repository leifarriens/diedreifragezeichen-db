import mongoose from 'mongoose';

import type { FolgeWithId } from '@/models/folge';
import type { RatingWithId } from '@/models/rating';

export type RatingWithFolge = RatingWithId & {
  folge: FolgeWithId;
};

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

export type MongoId = mongoose.Types.ObjectId | string;
