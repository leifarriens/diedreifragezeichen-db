export interface CommunityRating {
  folgeId: number;
  numberOfRatings: number;
  score: number;
}

export interface Rating {
  folgeId: number;
  score: number;
  updatedAt: string;
}

export interface RatingRepository {
  findAllFolgenCommunityRatings(): Promise<CommunityRating[]>;
  findAllUserRatings(input: { userId: string }): Promise<Rating[]>;
  findCommunityFolgenRating(input: {
    folgeId: number;
  }): Promise<CommunityRating | null>;
  findUserFolgenRating(input: {
    folgeId: number;
    userId: string;
  }): Promise<null | Rating>;
  removeRating(input: { folgeId: number; userId: string }): Promise<void>;
  setRating(input: {
    folgeId: number;
    score: number;
    userId: string;
  }): Promise<Rating>;
}
