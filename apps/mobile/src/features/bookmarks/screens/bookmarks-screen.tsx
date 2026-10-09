import {
  type BookmarkDateSortOption,
  createFolgenFilter,
  sortFolgen,
} from "@ddfdb/core";
import { Stack } from "expo-router";
import { useMemo, useState } from "react";
import { ActivityIndicator } from "react-native";

import { useFolgen } from "@/api/use-folgen";
import { useHydrateFolgenWithUserData } from "@/api/use-hydrate-folgen-with-user-data";
import { buildHeaderSortMenu } from "@/components/header-sort-menu";
import { FolgenList } from "@/features/folgen/components/folgen-list/folgen-list";

import { useUserBookmarks } from "../use-user-bookmarks";

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

  const hydratedFolgen = useHydrateFolgenWithUserData(bookmarkedFolgen ?? []);

  const filteredFolgen = useMemo(
    () => createFolgenFilter(hydratedFolgen).search(searchTerm).results(),
    [hydratedFolgen, searchTerm],
  );

  const sortedFolgen = useMemo(
    () => sortFolgen(filteredFolgen, sortOption),
    [filteredFolgen, sortOption],
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
            placeholder: "Titel, Nummer oder Erscheinungsjahr",
            placement: "integratedCentered",
          },
          title: "Gespeichert",
          unstable_headerRightItems: () => [
            ...buildHeaderSortMenu({
              onSortValueChange(value) {
                setSortOption({ by: "bookmarkedAt", order: value });
              },
              options: [
                { label: "Neueste zuerst", value: "newest" },
                { label: "Älteste zuerst", value: "oldest" },
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
          emptyMessage="Nix hier" // TODO
          folgen={displayedFolgen}
          isRefreshing={isRefreshing}
          ListHeaderComponent={null}
          maintainVisibleContentPosition={{ disabled: true }}
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

  const userBookmarkedFolgenIds = new Set<number>(
    userBookmarksQuery.data?.map(({ folgeId }) => folgeId),
  );

  function refresh() {
    void userBookmarksQuery.refetch();
  }

  return {
    data: folgenQuery.data?.filter((folge) =>
      userBookmarkedFolgenIds.has(folge.id),
    ),
    isLoading: folgenQuery.isLoading || userBookmarksQuery.isLoading,
    isRefreshing: userBookmarksQuery.isRefetching,
    refresh,
  };
}
