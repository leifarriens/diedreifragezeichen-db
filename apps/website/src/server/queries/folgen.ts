import "server-only";
import {
  enrichFolgenWithCommunityRatings,
  enrichFolgeWithCommunityRating,
  type FolgeWithCommunityRating,
} from "@ddfdb/core";
import { getFolgeByMongoId } from "@ddfdb/legacy-api";
import { cacheLife, cacheTag } from "next/cache";

import { archivApi, ArchivApiError } from "../archiv-api";
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

export async function getFolgeByLegacyId(legacyId: string) {
  "use cache";

  cacheLife(profile);

  cacheTag(`legacy-folge:${legacyId}`);

  const legacyFolge = await getFolgeByMongoId(legacyId);

  if (!legacyFolge) {
    return null;
  }

  const folgen = await getAllFolgenWithCommunityRatings();

  return (
    folgen.find((folge) => {
      if (!folge.streaming.spotify) return false;

      return folge.streaming.spotify.id === legacyFolge.spotify_id;
    }) ?? null
  );
}

export async function getFolgeWithCommunityRatingById(
  folgeId: number,
): Promise<FolgeWithCommunityRating | null> {
  "use cache";

  cacheLife(profile);

  cacheTag(`public-folge:${folgeId.toString()}`);

  const [archiveFolge, communityRating] = await Promise.all([
    archivApi.getFolgeById(folgeId).catch((error: unknown) => {
      if (error instanceof ArchivApiError && error.status === 404) {
        return null;
      }
      throw error;
    }),
    getCommunityRatingForFolge(folgeId),
  ]);

  if (archiveFolge === null) {
    return null;
  }

  return enrichFolgeWithCommunityRating(archiveFolge, communityRating);
}
