import mongoose from 'mongoose';

import type { Folge } from '@/models/folge';

// export type Rating = {
//   user: string;
//   folge: mongoose.Types.ObjectId;
//   value: number;
// };

export interface RatingWithFolge {
  _id: string;
  createdAt: Date;
  user: string;
  value: number;
  updatedAt: Date;
  folge: Folge;
}

export type SpotifyFolge = {
  id: string;
  name: string;
  images: {
    url: string;
    height: number;
    width: number;
  }[];
  release_date: Date;
};

// export type User = {
//   _id: string;
//   name: string;
//   email: string;
//   image: string;
//   emailVerified: boolean;
//   list: string[];
// };

export type YearRange = {
  min: Date;
  max: Date;
};

export type MongoId = mongoose.Types.ObjectId | string;
