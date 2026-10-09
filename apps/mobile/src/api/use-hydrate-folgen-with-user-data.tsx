import { useMemo } from "react";

import type { FolgeWithCommunityRating } from "@/api/types";

import { useUserBookmarks } from "@/features/bookmarks/use-user-bookmarks";
import { useUserListened } from "@/features/listened/use-user-listened";
import { useUserRatings } from "@/features/ratings/hooks/use-user-ratings";

interface FolgenUserData {
  bookmarkedAt: null | string;
  hasListened: boolean;
  isBookmarked: boolean;
  listenedAt: null | string;
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
  const { data: userListened } = useUserListened();

  return useMemo(() => {
    if (folgen.length === 0) {
      return [];
    }

    const ratingsByFolgeId = new Map(
      userRatings?.map((rating) => [rating.folgeId, rating] as const),
    );

    const bookmarkedFolgeIds = new Map(
      userBookmarks?.map(
        ({ createdAt, folgeId }) => [folgeId, createdAt] as const,
      ),
    );

    const listenedFolgeIds = new Map(
      userListened?.map(
        ({ createdAt, folgeId }) => [folgeId, createdAt] as const,
      ),
    );

    return folgen.map((folge) => {
      const userRating = ratingsByFolgeId.get(folge.id);
      const bookmarkedAt = bookmarkedFolgeIds.get(folge.id);
      const listenedAt = listenedFolgeIds.get(folge.id);

      return {
        ...folge,
        bookmarkedAt: bookmarkedAt ?? null,
        hasListened: Boolean(listenedAt),
        isBookmarked: Boolean(bookmarkedAt),
        listenedAt: listenedAt ?? null,
        userRating: userRating?.score ?? null,
        userRatingUpdatedAt: userRating?.updatedAt ?? null,
      };
    });
  }, [folgen, userRatings, userBookmarks, userListened]);
}
