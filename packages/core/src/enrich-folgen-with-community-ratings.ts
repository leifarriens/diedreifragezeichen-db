import type { Folge } from "@ddfdb/archiv/contracts";

export interface CommunityRatingSummary {
  numberOfRatings: number;
  popularity: number;
  score: number;
  updatedAt: string;
}

export type FolgeWithCommunityRating<T extends { id: number } = Folge> = T & {
  communityRating: CommunityRatingSummary | null;
};

interface CommunityRatingRecord extends CommunityRatingSummary {
  folgeId: number;
}

/**
 * Adds community ratings to Folgen by ID. Folges without a rating receive null.
 */
export function enrichFolgenWithCommunityRatings<T extends { id: number }>(
  folgen: readonly T[],
  communityRatings: readonly CommunityRatingRecord[] = [],
): FolgeWithCommunityRating<T>[] {
  if (folgen.length === 0) {
    return [];
  }

  const ratingsByFolgeId = new Map(
    communityRatings.map((rating) => [rating.folgeId, rating] as const),
  );

  return folgen.map((folge) =>
    enrichFolgeWithCommunityRating(folge, ratingsByFolgeId.get(folge.id)),
  );
}

/**
 * Adds a community rating to one Folge, projecting only the fields used by clients.
 */
export function enrichFolgeWithCommunityRating<T extends { id: number }>(
  folge: T,
  communityRating: CommunityRatingRecord | null | undefined,
): FolgeWithCommunityRating<T> {
  return {
    ...folge,
    communityRating: communityRating
      ? {
          numberOfRatings: communityRating.numberOfRatings,
          popularity: communityRating.popularity,
          score: communityRating.score,
          updatedAt: communityRating.updatedAt,
        }
      : null,
  };
}
