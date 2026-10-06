import type { FolgeWithCommunityRating } from "@/lib/types";

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

    const ratingsByFolgeId = new Map(
      communityRatings.map((rating) => [rating.folgeId, rating] as const),
    );

    return archiveFolgen.map((folge) => {
      const communityRating = ratingsByFolgeId.get(folge.id) ?? null;

      return {
        ...folge,
        communityRating,
      };
    });
  },

  async getFolgeWithCommunityRatingById(folgeId) {
    const [archiveFolge, communityRating] = await Promise.all([
      archivApi.getFolgeById(folgeId),
      caller.ratings.getCommunityForFolge({ folgeId }),
    ]);

    return {
      ...archiveFolge,
      communityRating,
    };
  },
};
