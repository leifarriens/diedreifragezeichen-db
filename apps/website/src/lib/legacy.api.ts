export interface Folge {
  _id: string;
  created_at: string;
  deezer_id?: string; // Can be empty string
  images: {
    height: number;
    url: string;
    width: number;
  }[];
  inhalt: string; // Can be empty string
  isHidden: false;
  name: string;
  number: string; // Can be empty string
  number_of_ratings: number;
  popularity: number;
  rating: number;
  release_date: string;
  spotify_id: string;
  sprecher: string; // Can be empty string
  type: "regular" | "special";
  upc: string; // Can be empty string
  updated_at: string;
  weblink: string; // Can be empty string
}
