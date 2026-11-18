import { selectCollectionFolgen } from "@ddfdb/core";
import { useMemo } from "react";

import { useFolgen } from "@/features/folgen/hooks/use-folgen";

import { useUserRatings } from "./use-ratings";

export function useUserRatedFolgen() {
  const folgenQuery = useFolgen();
  const userRatingsQuery = useUserRatings();

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
  };
}
