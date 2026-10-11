import {
  createFolgenFilter,
  type ListenedDateSortOption,
  selectCollectionFolgen,
  sortFolgen,
} from "@ddfdb/core";
import { Stack } from "expo-router";
import { useMemo, useState } from "react";
import { ActivityIndicator } from "react-native";

import { useFolgen } from "@/api/use-folgen";
import { useHydrateFolgenWithUserData } from "@/api/use-hydrate-folgen-with-user-data";
import { buildHeaderSortMenu } from "@/components/header-sort-menu";
import { FolgenList } from "@/features/folgen-list/folgen-list";

import { useUserListened } from "../use-listened";

export function ListenedScreen() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState<ListenedDateSortOption>({
    by: "listenedAt",
    order: "newest",
  });

  const {
    data: listenedFolgen,
    isLoading,
    isRefreshing,
    refresh,
  } = useUserListenedFolgen();

  const hydratedFolgen = useHydrateFolgenWithUserData(listenedFolgen);

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
          title: "Gehört",
          unstable_headerRightItems: () => [
            ...buildHeaderSortMenu({
              onSortValueChange(value) {
                setSortOption({ by: "listenedAt", order: value });
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
          detailPathname="/(tabs)/gehoert/[folgeId]"
          emptyMessage={
            listenedFolgen.length === 0
              ? "Du hast noch keine Folgen als gehört markiert"
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
