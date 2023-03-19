import type { Document } from 'mongoose';

import type { FolgeWithId } from '@/models/folge';
import type { RatingWithId } from '@/models/rating';

export type RatingWithFolge = RatingWithId & {
  folge: FolgeWithId;
};

export interface SpotifyAlbum {
  id: string;
  name: string;
  images: {
    url: string;
    height: number;
    width: number;
  }[];
  release_date: Date;
  artists: unknown;
}

export type MongoId = string; //mongoose.Types.ObjectId | string;

export type SchemaType<S> = S & Document<string>;
