import { selectCollectionFolgen } from "@ddfdb/core";
import { l } from "@ddfdb/core/labels";
import { useMemo } from "react";

import { useFolgenWithCommunityRating } from "@/api/use-folgen-with-community-rating";
import { UserCollection } from "@/features/user-collection/user-collection";

import { useUserBookmarks } from "../use-bookmarks";

export function BookmarksScreen() {
  const {
    data: bookmarkedFolgen,
    isLoading,
    isRefreshing,
    refresh,
  } = useUserBookmarkedFolgen();

  return (
    <UserCollection
      detailPathname="/(tabs)/gespeichert/[folgeId]"
      emptyMessage={l.BOOKMARKS.EMPTY_PLACEHOLDER}
      folgen={bookmarkedFolgen}
      initialSortValue="newest"
      isInitialLoading={isLoading}
      isRefreshing={isRefreshing}
      onRequestRefresh={refresh}
      searchPlaceholder={l.BOOKMARKS.SEARCH_PLACEHOLDER}
      sortLabel={l.BOOKMARKS.SORTING.LABEL}
      sortOptions={[
        {
          label: l.BOOKMARKS.SORTING.NEWEST_FIRST,
          sort: { by: "bookmarkedAt", order: "newest" },
          value: "newest",
        },
        {
          label: l.BOOKMARKS.SORTING.OLDEST_FIRST,
          sort: { by: "bookmarkedAt", order: "oldest" },
          value: "oldest",
        },
      ]}
      title={l.BOOKMARKS.NAME}
      unauthenticatedMessage={l.BOOKMARKS.UNAUTHENTICATED_MESSAGE}
    />
  );
}

function useUserBookmarkedFolgen() {
  const folgenQuery = useFolgenWithCommunityRating();
  const userBookmarksQuery = useUserBookmarks();

  function refresh() {
    void userBookmarksQuery.refetch();
  }

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
    refresh,
  };
}
