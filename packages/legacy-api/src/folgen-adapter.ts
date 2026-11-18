import type { Folge } from "@ddfdb/archiv/contracts";

import type { LegacyFolge } from "./types";

interface CommunityRating {
  numberOfRatings: number | undefined;
  popularity: number | undefined;
  score: number;
}

export function buildLegacyFolge(
  folge: LegacyFolge,
  update: Folge & { communityRating: CommunityRating | null },
): Omit<LegacyFolge, "_id"> & {
  _id: string;
  id: number;
} {
  const { numberOfRatings, popularity, score } = adaptRating(
    update.communityRating,
  );

  return {
    _id: folge._id.toHexString(),
    created_at: folge.created_at,
    deezer_id: update.streaming.deezer?.id ?? "",
    id: update.id,
    images: adaptImages(folge, update),
    inhalt: update.description ?? "",
    isHidden: false,
    name: update.title,
    number: String(update.number),
    number_of_ratings: numberOfRatings,
    popularity: popularity,
    rating: score,
    release_date: folge.release_date,
    spotify_id: update.streaming.spotify?.id ?? "",
    sprecher: update.voiceRoles
      .map(({ role, speaker }) => `${role} - ${speaker}`)
      .join(" \n"),
    type: folge.type,
    upc: folge.upc ?? "",
    updated_at: folge.updated_at,
    weblink: update.weblink ?? "",
  };
}

function adaptImages(folge: LegacyFolge, update: Folge): LegacyFolge["images"] {
  return folge.images.length > 0
    ? folge.images
    : [
        ...(update.cover
          ? [
              {
                height: 0,
                url: update.cover,
                width: 0,
              },
            ]
          : []),
      ];
}

function adaptRating(communityRating: CommunityRating | null): {
  numberOfRatings: number;
  popularity: number;
  score: number;
} {
  return {
    numberOfRatings: communityRating?.numberOfRatings ?? 0,
    popularity: communityRating?.popularity ?? 0,
    score: communityRating?.score
      ? Math.round((communityRating.score / 3) * 10 * 2) / 2
      : 0,
  };
}
