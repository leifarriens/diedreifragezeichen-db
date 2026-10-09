import {
  enrichFolgenWithCommunityRatings,
  enrichFolgeWithCommunityRating,
  type FolgeWithCommunityRating,
} from "@ddfdb/core";

import { archivApi } from "@/lib/archiv-api";
import { caller } from "@/trpc/server";

interface FolgenService {
  getAllFolgenWithCommunityRatings(): Promise<FolgeWithCommunityRating[]>;
  getFolgeWithCommunityRatingById(
    folgeId: number,
  ): Promise<FolgeWithCommunityRating>;
}

export const folgenService: FolgenService = {
  async getAllFolgenWithCommunityRatings() {
    const [archiveFolgen, communityRatings] = await Promise.all([
      archivApi.getFolgen(),
      caller.ratings.getAllCommunityRatings().catch((error: unknown) => {
        console.error("Could not load community ratings", error);
        return [];
      }),
    ]);

    return enrichFolgenWithCommunityRatings(archiveFolgen, communityRatings);
  },

  async getFolgeWithCommunityRatingById(folgeId) {
    const [archiveFolge, communityRating] = await Promise.all([
      archivApi.getFolgeById(folgeId),
      caller.ratings.getCommunityForFolge({ folgeId }),
    ]);

    return enrichFolgeWithCommunityRating(archiveFolge, communityRating);
  },
};
