interface Folge {
  name: string;
  number: string;
  createdAt: string;
  updatedAt: string;
  type: string;
  isSpecial: boolean;
  release_date: string;
  images: Image[];
  spotify_id: string;
  _id: string;
  ratings: object[];
}

interface Image {
  url: string;
  height: number;
  width: number;
}
