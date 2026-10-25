import "server-only";
import type { FolgeListItem } from "@ddfdb/client";

import {
  enrichFolgenWithCommunityRatings,
  type FolgeWithCommunityRating,
} from "@ddfdb/core";
import { getFolgeByMongoId } from "@ddfdb/legacy-api";
import { cacheLife, cacheTag } from "next/cache";

import { archivApi } from "../archiv-api";
import { profile } from "./cache";
import { getAllCommunityRatings } from "./ratings";

export async function getAllFolgenWithCommunityRatings(): Promise<
  FolgeWithCommunityRating[]
> {
  "use cache";

  cacheLife(profile);

  cacheTag("public-folgen");

  const [archiveFolgen, communityRatings] = await Promise.all([
    archivApi.getFolgen(),
    getAllCommunityRatings(),
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

/** Returns only the public fields needed for episode lists and client search. */
export async function getFolgeListItems(): Promise<FolgeListItem[]> {
  const folgen = await getAllFolgenWithCommunityRatings();

  return folgen.map((folge) => ({
    artwork: folge.artwork,
    authors: folge.authors,
    collection: folge.collection,
    communityRating:
      folge.communityRating === null
        ? null
        : { score: folge.communityRating.score },
    cover: folge.cover,
    id: folge.id,
    number: folge.number,
    release_date: folge.release_date,
    script_authors: folge.script_authors,
    title: folge.title,
    total_duration: folge.total_duration,
    voice_roles: folge.voice_roles,
  }));
}

export async function getFolgeWithCommunityRatingById(
  folgeId: number,
): Promise<FolgeWithCommunityRating | null> {
  const folgen = await getAllFolgenWithCommunityRatings();

  const folge = folgen.find((f) => f.id === folgeId);

  return folge ?? null;
}
