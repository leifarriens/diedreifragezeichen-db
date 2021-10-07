interface IFolge {
  name: string;
  number: string;
  createdAt: string;
  updatedAt: string;
  type: string;
  isSpecial: boolean;
  release_date: string;
  images: IImage[];
  spotify_id: string;
  _id: string;
  ratings: object[];
}

interface IImage {
  url: string;
  height: number;
  width: number;
}
