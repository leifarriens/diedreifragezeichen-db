import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { useTRPC } from "@/trpc/client";

import type { FolgeWithCommunityRating } from "./types";

import { useAuth } from "./use-auth";

export function useHydrateFolgenWithUserData<
  T extends FolgeWithCommunityRating,
>(
  folgen: T[],
): (T & {
  isBookmarked: boolean;
  userRating: null | number;
  userRatingUpdatedAt: null | string;
})[] {
  const trpc = useTRPC();
  const { isAuthenticated } = useAuth();

  const { data: userRatings } = useQuery(
    trpc.ratings.getMine.queryOptions(undefined, {
      enabled: isAuthenticated,
    }),
  );

  const { data: userBookmarks } = useQuery(
    trpc.bookmarks.getUserBookmarks.queryOptions(undefined, {
      enabled: isAuthenticated,
    }),
  );

  return useMemo(() => {
    const ratingsByFolgeId = new Map(
      (isAuthenticated ? userRatings : undefined)?.map(
        (rating) => [rating.folgeId, rating] as const,
      ),
    );
    const bookmarkedFolgeIds = new Set(
      (isAuthenticated ? userBookmarks : undefined)?.map(
        ({ folgeId }) => folgeId,
      ),
    );

    return folgen.map((folge) => {
      const userRating = ratingsByFolgeId.get(folge.id);

      return {
        ...folge,
        isBookmarked: bookmarkedFolgeIds.has(folge.id),
        userRating: userRating?.score ?? null,
        userRatingUpdatedAt: userRating?.updatedAt ?? null,
      };
    });
  }, [folgen, isAuthenticated, userRatings, userBookmarks]);
}
