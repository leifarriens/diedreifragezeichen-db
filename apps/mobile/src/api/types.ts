export type ExternalUrl = `${string}:${string}` | `//${string}`;

export interface Folge {
  _id: string;
  created_at: string;
  images: FolgeImage[];
  inhalt: string;
  name: string;
  number: string;
  number_of_ratings: number;
  popularity: number;
  rating: number;
  release_date: string;
  spotify_id: string;
  sprecher: string;
  type: string;
  updated_at: string;
  weblink: "" | ExternalUrl;
}

export interface FolgeImage {
  height: number;
  url: string;
  width: number;
}
