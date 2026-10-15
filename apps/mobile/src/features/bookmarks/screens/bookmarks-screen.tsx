import { useSearch } from "@ddfdb/client";
import {
  type BookmarkDateSortOption,
  selectCollectionFolgen,
  sortFolgen,
} from "@ddfdb/core";
import { l } from "@ddfdb/core/labels";
import { Stack } from "expo-router";
import { useMemo, useState } from "react";
import { ActivityIndicator } from "react-native";

import { useFolgen } from "@/api/use-folgen";
import { useHydrateFolgenWithUserData } from "@/api/use-hydrate-folgen-with-user-data";
import { buildHeaderSortMenu } from "@/components/header-sort-menu";
import { FolgenList } from "@/features/folgen-list/folgen-list";

import { useUserBookmarks } from "../use-bookmarks";

export function BookmarksScreen() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState<BookmarkDateSortOption>({
    by: "bookmarkedAt",
    order: "newest",
  });

  const {
    data: bookmarkedFolgen,
    isLoading,
    isRefreshing,
    refresh,
  } = useUserBookmarkedFolgen();

  const searchQuery = useSearch(bookmarkedFolgen, { term: searchTerm });

  const hydratedFolgen = useHydrateFolgenWithUserData(
    searchQuery.data?.results ?? bookmarkedFolgen,
  );

  const sortedFolgen = useMemo(
    () => sortFolgen(hydratedFolgen, sortOption),
    [hydratedFolgen, sortOption],
  );

  const displayedFolgen = sortedFolgen;

  return (
    <>
      <Stack.Screen
        options={{
          headerSearchBarOptions: {
            hideWhenScrolling: false,
            onChangeText: (event) => {
              setSearchTerm(event.nativeEvent.text);
            },
            placeholder: l.BOOKMARKS.SEARCH_PLACEHOLDER,
            placement: "integratedCentered",
          },
          title: l.BOOKMARKS.NAME,
          unstable_headerRightItems: () => [
            ...buildHeaderSortMenu({
              label: l.BOOKMARKS.SORTING.LABEL,
              onSortValueChange(value) {
                setSortOption({ by: "bookmarkedAt", order: value });
              },
              options: [
                { label: l.BOOKMARKS.SORTING.NEWEST_FIRST, value: "newest" },
                { label: l.BOOKMARKS.SORTING.OLDEST_FIRST, value: "oldest" },
              ],
              sortValue: sortOption.order,
            }),
          ],
        }}
      />

      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <FolgenList
          detailPathname="/(tabs)/gespeichert/[folgeId]"
          emptyMessage={
            bookmarkedFolgen.length === 0
              ? l.BOOKMARKS.EMPTY_PLACEHOLDER
              : undefined
          }
          folgen={displayedFolgen}
          isInitialLoading={isLoading}
          isRefreshing={isRefreshing}
          onRequestRefresh={refresh}
          viewMode="list"
        />
      )}
    </>
  );
}

function useUserBookmarkedFolgen() {
  const folgenQuery = useFolgen();
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
