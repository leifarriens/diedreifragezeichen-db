import "server-only";
import {
  enrichFolgenWithCommunityRatings,
  enrichFolgeWithCommunityRating,
  type FolgeWithCommunityRating,
} from "@ddfdb/core";

import { caller } from "@/trpc/server";

import { archivApi } from "../archiv-api";

export async function getAllFolgenWithCommunityRatings(): Promise<
  FolgeWithCommunityRating[]
> {
  const [archiveFolgen, communityRatings] = await Promise.all([
    archivApi.getFolgen(),
    caller.ratings.getAllCommunityRatings().catch((error: unknown) => {
      console.error("Could not load community ratings", error);
      return [];
    }),
  ]);

  return enrichFolgenWithCommunityRatings(archiveFolgen, communityRatings);
}

export async function getFolgeWithCommunityRatingById(
  folgeId: number,
): Promise<FolgeWithCommunityRating> {
  const [archiveFolge, communityRating] = await Promise.all([
    archivApi.getFolgeById(folgeId),
    caller.ratings.getCommunityRatingForFolge({ folgeId }),
  ]);

  return enrichFolgeWithCommunityRating(archiveFolge, communityRating);
}
