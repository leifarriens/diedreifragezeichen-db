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
  return {
    ...folge,
    _id: folge._id.toHexString(),
    deezer_id: update.streaming.deezer?.id ?? "",
    id: update.id,
    images: adaptImages(folge, update),
    inhalt: update.description ?? "",
    isHidden: false,
    name: update.title,
    number: String(update.number),
    spotify_id: update.streaming.spotify?.id ?? "",
    sprecher: update.voice_roles
      .map(({ role, speaker }) => `${role} - ${speaker}`)
      .join(", "),
    weblink: update.weblink ?? "",
    ...adaptRating(update.communityRating),
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
