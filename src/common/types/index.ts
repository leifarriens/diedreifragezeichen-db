import mongoose from 'mongoose';

import type { FolgeWithId } from '@/models/folge';
import { RatingWithId } from '@/models/rating';
import { UserWithId } from '@/models/user';

export type FolgeType = 'regular' | 'special';

export type RatingWithFolge = RatingWithId & {
  folge: FolgeWithId;
};

export type ReviewWithUser = RatingWithId & {
  user: UserWithId;
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

export type YearRange = {
  min: Date;
  max: Date;
};

export type MongoId = mongoose.Types.ObjectId | string;

export interface ApiResponse<R = unknown[]> {
  items: R;
  limit: number;
  offset: number;
  total: number;
}
