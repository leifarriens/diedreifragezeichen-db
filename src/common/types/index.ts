export type FolgeType = {
  name: string;
  number: string;
  createdAt: Date;
  updatedAt: Date;
  type: string;
  release_date: Date;
  images: Image[];
  spotify_id: string;
  _id: string;
  rating: number;
  number_of_ratings: number;
  popularity: number;
  user_rating?: number | null;
};

export type Image = {
  url: string;
  height: number;
  width: number;
};

export type Rating = {
  user: string;
  folge: string;
  value: number;
};

export interface RatingWithFolge {
  _id: string;
  createdAt: Date;
  user: string;
  value: number;
  updatedAt: Date;
  folge: FolgeType;
}

export type SpotifyFolge = {
  id: string;
  name: string;
  images: Image[];
  release_date: Date;
};
