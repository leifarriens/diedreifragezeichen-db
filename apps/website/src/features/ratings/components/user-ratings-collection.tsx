"use client";

import { l } from "@ddfdb/core/labels";

import { PageLoadingIndicator } from "@/components/ui/loading-indicator/loading-indicator";
import { UserCollection } from "@/features/profile/components/user-collection";

import { useUserRatedFolgen } from "../hooks/use-user-rated-folgen";

export function UserRatingsCollection() {
  const { data: userRatedFolgen, isLoading } = useUserRatedFolgen();

  if (isLoading) {
    return <PageLoadingIndicator />;
  }

  return (
    <UserCollection
      emptyMessage={l.RATINGS.EMPTY_PLACEHOLDER}
      folgen={userRatedFolgen}
      initialSortValue="recent"
      searchPlaceholder={l.RATINGS.SEARCH_PLACEHOLDER}
      sortLabel={l.RATINGS.SORTING.LABEL}
      sortOptions={[
        {
          label: l.RATINGS.SORTING.NEWEST_FIRST,
          sort: { by: "userRatingUpdatedAt", order: "newest" },
          value: "recent",
        },
        {
          label: l.RATINGS.SORTING.HIGHEST_RATED_FIRST,
          sort: { by: "userRating", order: "highest" },
          value: "highest",
        },
        {
          label: l.RATINGS.SORTING.LOWEST_RATED_FIRST,
          sort: { by: "userRating", order: "lowest" },
          value: "lowest",
        },
      ]}
    />
  );
}
