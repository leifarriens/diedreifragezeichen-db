import { useMemo } from "react";

import type { FolgeWithCommunityRating } from "./types";

import { useUserBookmarks } from "./use-user-bookmarks";
import { useUserRatings } from "./use-user-ratings";

interface FolgenUserData {
  bookmarkedAt: null | string;
  isBookmarked: boolean;
  userRating: null | number;
  userRatingUpdatedAt: null | string;
}

/**
 * Hydrates an array of Folgen with the user's bookmark and rating data.
 */
export function useHydrateFolgenWithUserData<
  T extends FolgeWithCommunityRating,
>(folgen: T[]): (FolgenUserData & T)[] {
  const { data: userRatings } = useUserRatings();

  const { data: userBookmarks } = useUserBookmarks();

  return useMemo(() => {
    const ratingsByFolgeId = new Map(
      userRatings?.map((rating) => [rating.folgeId, rating] as const),
    );
    const bookmarkedFolgeIds = new Map(
      userBookmarks?.map(
        ({ createdAt, folgeId }) => [folgeId, createdAt] as const,
      ),
    );

    return folgen.map((folge) => {
      const userRating = ratingsByFolgeId.get(folge.id);
      const bookmarkedAt = bookmarkedFolgeIds.get(folge.id);

      return {
        ...folge,
        bookmarkedAt: bookmarkedAt ?? null,
        isBookmarked: Boolean(bookmarkedAt),
        userRating: userRating?.score ?? null,
        userRatingUpdatedAt: userRating?.updatedAt ?? null,
      };
    });
  }, [folgen, userRatings, userBookmarks]);
}
