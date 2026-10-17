import { selectCollectionFolgen } from "@ddfdb/core";
import { l } from "@ddfdb/core/labels";
import { useMemo } from "react";

import { useFolgen } from "@/api/use-folgen";
import { UserCollection } from "@/features/user-collection/user-collection";

import { useUserRatings } from "../hooks/use-ratings";

export function RatingsScreen() {
  const {
    data: ratedFolgen,
    isLoading,
    isRefreshing,
    refresh,
  } = useUserRatedFolgen();

  return (
    <UserCollection
      detailPathname="/(tabs)/bewertet/[folgeId]"
      emptyMessage={l.RATINGS.EMPTY_PLACEHOLDER}
      folgen={ratedFolgen}
      initialSortValue="recent"
      isInitialLoading={isLoading}
      isRefreshing={isRefreshing}
      onRequestRefresh={refresh}
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
      title={l.RATINGS.TITLE}
    />
  );
}

function useUserRatedFolgen() {
  const folgenQuery = useFolgen();
  const userRatingsQuery = useUserRatings();

  function refresh() {
    void userRatingsQuery.refetch();
  }

  return {
    data: useMemo(
      () =>
        selectCollectionFolgen(
          folgenQuery.data ?? [],
          userRatingsQuery.data ?? [],
        ),
      [folgenQuery.data, userRatingsQuery.data],
    ),
    isLoading: folgenQuery.isLoading || userRatingsQuery.isLoading,
    isRefreshing: userRatingsQuery.isRefetching,
    refresh,
  };
}
