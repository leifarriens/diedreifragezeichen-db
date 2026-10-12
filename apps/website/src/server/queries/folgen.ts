import "server-only";
import {
  enrichFolgenWithCommunityRatings,
  enrichFolgeWithCommunityRating,
  type FolgeWithCommunityRating,
} from "@ddfdb/core";
import { cacheLife, cacheTag } from "next/cache";

import { archivApi } from "../archiv-api";
import { profile } from "./cache";
import { getAllCommunityRatings, getCommunityRatingForFolge } from "./ratings";

export async function getAllFolgenWithCommunityRatings(): Promise<
  FolgeWithCommunityRating[]
> {
  "use cache";

  cacheLife(profile);

  cacheTag("public-folgen");

  const [archiveFolgen, communityRatings] = await Promise.all([
    archivApi.getFolgen(),
    getAllCommunityRatings().catch((error: unknown) => {
      console.error("Could not load community ratings", error);
      return [];
    }),
  ]);

  return enrichFolgenWithCommunityRatings(archiveFolgen, communityRatings);
}

export async function getFolgeWithCommunityRatingById(
  folgeId: number,
): Promise<FolgeWithCommunityRating> {
  "use cache";

  cacheLife(profile);

  cacheTag(`public-folge:${folgeId.toString()}`);

  const [archiveFolge, communityRating] = await Promise.all([
    archivApi.getFolgeById(folgeId),
    getCommunityRatingForFolge(folgeId),
  ]);

  return enrichFolgeWithCommunityRating(archiveFolge, communityRating);
}
