import { useSearch } from "@ddfdb/client";
import {
  selectCollectionFolgen,
  sortFolgen,
  type UserRatingSortOption,
  type UserRatingUpdatedSortOption,
} from "@ddfdb/core";
import { l } from "@ddfdb/core/labels";
import { Stack } from "expo-router";
import { useMemo, useState } from "react";
import { ActivityIndicator } from "react-native";

import { useFolgen } from "@/api/use-folgen";
import { useHydrateFolgenWithUserData } from "@/api/use-hydrate-folgen-with-user-data";
import { buildHeaderSortMenu } from "@/components/header-sort-menu";
import { FolgenList } from "@/features/folgen-list/folgen-list";

import { useUserRatings } from "../hooks/use-ratings";

type UserRatedFolgenSortOption =
  UserRatingSortOption | UserRatingUpdatedSortOption;

export function RatingsScreen() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState<UserRatedFolgenSortOption>({
    by: "userRatingUpdatedAt",
    order: "newest",
  });

  const {
    data: ratedFolgen,
    isLoading,
    isRefreshing,
    refresh,
  } = useUserRatedFolgen();

  const searchQuery = useSearch(ratedFolgen, { term: searchTerm });

  const hydratedFolgen = useHydrateFolgenWithUserData(
    searchQuery.data?.results ?? ratedFolgen,
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
            placeholder: l.RATINGS.SEARCH_PLACEHOLDER,
            placement: "integratedCentered",
          },
          title: l.RATINGS.TITLE,
          unstable_headerRightItems: () => [
            ...buildHeaderSortMenu({
              label: l.RATINGS.SORTING.LABEL,
              onSortValueChange(order) {
                setSortOption(
                  order === "newest"
                    ? { by: "userRatingUpdatedAt", order }
                    : { by: "userRating", order },
                );
              },
              options: [
                { label: l.RATINGS.SORTING.NEWEST_FIRST, value: "newest" },
                { label: l.RATINGS.SORTING.HIGHEST_RATED_FIRST, value: "highest" },
                { label: l.RATINGS.SORTING.LOWEST_RATED_FIRST, value: "lowest" },
              ],
              sortValue:
                sortOption.by === "userRatingUpdatedAt"
                  ? "newest"
                  : sortOption.order,
            }),
          ],
        }}
      />

      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <FolgenList
          detailPathname="/(tabs)/bewertet/[folgeId]"
          emptyMessage={
            ratedFolgen.length === 0
              ? l.RATINGS.EMPTY_PLACEHOLDER
              : undefined
          }
          folgen={displayedFolgen}
          isInitialLoading={isLoading}
          isRefreshing={isRefreshing}
          ListHeaderComponent={null}

          onRequestRefresh={refresh}
          viewMode="list"
        />
      )}
    </>
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
