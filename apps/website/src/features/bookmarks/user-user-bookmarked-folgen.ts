import { selectCollectionFolgen } from "@ddfdb/core";
import { useMemo } from "react";

import { useFolgen } from "@/features/folgen/hooks/use-folgen";

import { useUserBookmarks } from "./use-bookmarks";

export function useUserBookmarkedFolgen() {
  const folgenQuery = useFolgen();
  const userBookmarksQuery = useUserBookmarks();

  return {
    data: useMemo(
      () =>
        selectCollectionFolgen(
          folgenQuery.data ?? [],
          userBookmarksQuery.data ?? [],
        ),
      [folgenQuery.data, userBookmarksQuery.data],
    ),
    isLoading: folgenQuery.isLoading || userBookmarksQuery.isLoading,
    isRefreshing: userBookmarksQuery.isRefetching,
  };
}
