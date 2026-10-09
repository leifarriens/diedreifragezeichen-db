import {
  createFolgenFilter,
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
import { FolgenList } from "@/features/folgen/components/folgen-list/folgen-list";

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

  const hydratedFolgen = useHydrateFolgenWithUserData(ratedFolgen ?? []);

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
          detailPathname="/(tabs)/gespeichert/[folgeId]" // TODO: /(tabs)/bewertet/[folgeId]
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

function useUserRatedFolgen() {
  const folgenQuery = useFolgen();
  const userRatingsQuery = useUserRatings();

  const userRatedFolgenIds = new Set<number>(
    userRatingsQuery.data?.map((rating) => rating.folgeId),
  );

  function refresh() {
    void userRatingsQuery.refetch();
  }

  return {
    data: folgenQuery.data?.filter((folge) => userRatedFolgenIds.has(folge.id)),
    isLoading: folgenQuery.isLoading || userRatingsQuery.isLoading,
    isRefreshing: userRatingsQuery.isRefetching,
    refresh,
  };
}
