import type { ObjectId } from 'mongoose';

export type FolgeType = {
  name: string;
  number: string;
  createdAt: Date;
  updatedAt: Date;
  type: string;
  release_date: string;
  images: Image[];
  spotify_id: string;
  _id: ObjectId | string;
  rating: number;
  number_of_ratings: number;
  popularity: number;
  user_rating?: number;
};

export type Image = {
  url: string;
  height: number;
  width: number;
};
