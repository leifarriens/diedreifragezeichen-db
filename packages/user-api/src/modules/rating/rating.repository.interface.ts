export interface CommunityRating {
  folgeId: number;
  numberOfRatings: number;
  popularity: number;
  score: number;
  updatedAt: string;
}

export interface Rating {
  folgeId: number;
  score: number;
  updatedAt: string;
}

export interface RatingRepository {
  deleteUserRating(input: { folgeId: number; userId: string }): Promise<void>;
  findAllFolgenCommunityRatings(): Promise<CommunityRating[]>;
  findUserRatingsByUserId(input: { userId: string }): Promise<Rating[]>;
  upsertUserRating(input: {
    folgeId: number;
    score: number;
    userId: string;
  }): Promise<Rating>;
}
