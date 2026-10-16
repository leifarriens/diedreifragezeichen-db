import { selectCollectionFolgen } from "@ddfdb/core";
import { l } from "@ddfdb/core/labels";
import { useMemo } from "react";

import { useFolgen } from "@/api/use-folgen";
import { UserCollection } from "@/features/user-collection/user-collection";

import { useUserListened } from "../use-listened";

export function ListenedScreen() {
  const {
    data: listenedFolgen,
    isLoading,
    isRefreshing,
    refresh,
  } = useUserListenedFolgen();

  return (
    <UserCollection
      detailPathname="/(tabs)/gehoert/[folgeId]"
      emptyMessage={l.LISTENED.EMPTY_PLACEHOLDER}
      folgen={listenedFolgen}
      initialSortValue="newest"
      isInitialLoading={isLoading}
      isRefreshing={isRefreshing}
      onRequestRefresh={refresh}
      searchPlaceholder={l.LISTENED.SEARCH_PLACEHOLDER}
      sortLabel={l.LISTENED.SORTING.LABEL}
      sortOptions={[
        {
          label: l.LISTENED.SORTING.NEWEST_FIRST,
          sort: { by: "listenedAt", order: "newest" },
          value: "newest",
        },
        {
          label: l.LISTENED.SORTING.OLDEST_FIRST,
          sort: { by: "listenedAt", order: "oldest" },
          value: "oldest",
        },
      ]}
      title={l.LISTENED.NAME}
    />
  );
}

function useUserListenedFolgen() {
  const folgenQuery = useFolgen();
  const useUserListenedQuery = useUserListened();

  function refresh() {
    void useUserListenedQuery.refetch();
  }

  return {
    data: useMemo(
      () =>
        selectCollectionFolgen(
          folgenQuery.data ?? [],
          useUserListenedQuery.data ?? [],
        ),
      [folgenQuery.data, useUserListenedQuery.data],
    ),
    isLoading: folgenQuery.isLoading || useUserListenedQuery.isLoading,
    isRefreshing: useUserListenedQuery.isRefetching,
    refresh,
  };
}
