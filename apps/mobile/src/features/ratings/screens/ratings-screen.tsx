import {
  createFolgenFilter,
  selectCollectionFolgen,
  sortFolgen,
  type UserRatingSortOption,
  type UserRatingUpdatedSortOption,
} from "@ddfdb/core";
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

  const hydratedFolgen = useHydrateFolgenWithUserData(ratedFolgen);

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
          title: "Bewertete Folgen",
          unstable_headerRightItems: () => [
            ...buildHeaderSortMenu({
              onSortValueChange(order) {
                setSortOption(
                  order === "newest"
                    ? { by: "userRatingUpdatedAt", order }
                    : { by: "userRating", order },
                );
              },
              options: [
                { label: "Neueste Wertung", value: "newest" },
                { label: "Deine beste Wertung", value: "highest" },
                { label: "Deine schlechteste Wertung", value: "lowest" },
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
              ? "Du hast noch keine Folgen bewertet"
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
    data: selectCollectionFolgen(
      folgenQuery.data ?? [],
      userRatingsQuery.data ?? [],
    ),
    isLoading: folgenQuery.isLoading || userRatingsQuery.isLoading,
    isRefreshing: userRatingsQuery.isRefetching,
    refresh,
  };
}
