import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { useTRPC } from "@/trpc/client";

import type { FolgeWithCommunityRating } from "./types";

import { useAuth } from "./use-auth";
import { useUserBookmarks } from "./use-user-bookmarks";

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
  const trpc = useTRPC();
  const { isAuthenticated } = useAuth();

  const { data: userRatings } = useQuery(
    trpc.ratings.getMine.queryOptions(undefined, {
      enabled: isAuthenticated,
    }),
  );

  const { data: userBookmarks } = useUserBookmarks();

  return useMemo(() => {
    const ratingsByFolgeId = new Map(
      (isAuthenticated ? userRatings : undefined)?.map(
        (rating) => [rating.folgeId, rating] as const,
      ),
    );
    const bookmarkedFolgeIds = new Map(
      (isAuthenticated ? userBookmarks : undefined)?.map(
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
  }, [folgen, isAuthenticated, userRatings, userBookmarks]);
}
