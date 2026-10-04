import { Image } from "expo-image";
import { Stack, useRouter } from "expo-router";
import { useDeferredValue, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

import { useFolgen } from "@/api/use-folgen";
import logo from "@/assets/logo.png";
import { FolgenList } from "@/components/folgen-list/folgen-list";
import { headerSortMenu } from "@/features/folgen/header-sort-menu";
import { createFolgenQuery } from "@/features/folgen/query";
import { type SortOption } from "@/features/folgen/sort";
import { useArchiveFilters } from "@/providers/archive-filter-provider";

export default function ArchivScreen() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("dateDesc");
  const { filters } = useArchiveFilters();
  const deferredShowSpecials = useDeferredValue(filters.showSpecials);
  const query = useFolgen();
  const { error, fetchStatus, isError, isLoading, refetch } = query;

  const searchableEpisodes = useMemo(
    () =>
      query.data
        ? createFolgenQuery(query.data)
            .search(search)
            .dateRange({
              endDate: filters.endDate,
              startDate: filters.startDate,
            })
            .sort(sortBy)
            .results()
        : undefined,
    [query.data, search, sortBy, filters.startDate, filters.endDate],
  );

  const episodes = useMemo(
    () =>
      searchableEpisodes
        ? createFolgenQuery(searchableEpisodes)
            .showSpecials(deferredShowSpecials)
            .results()
        : undefined,
    [searchableEpisodes, deferredShowSpecials],
  );

  return (
    <>
      <Stack.Screen
        options={{
          headerSearchBarOptions: {
            hideWhenScrolling: false,
            onChangeText: (event) => {
              setSearch(event.nativeEvent.text);
            },
            placeholder: "Titel, Nummer oder Erscheinungsjahr",
            placement: "integratedCentered",
          },
          headerShown: true,
          headerTitle: () => (
            <Image
              contentFit="contain"
              source={logo}
              style={{ height: 30, width: 80 }}
            />
          ),
          title: "",
          unstable_headerLeftItems: () => [
            {
              icon: { name: "filemenu.and.pointer.arrow", type: "sfSymbol" },
              label: "Filter",
              onPress() {
                router.navigate("/(tabs)/(archiv)/filter");
              },
              type: "button",
            },
          ],
          unstable_headerRightItems: () =>
            headerSortMenu({ setSortBy, sortBy }),
        }}
      />

      <FolgenList
        detailPathname="/(tabs)/(archiv)/[folgeId]"
        folgen={episodes ?? []}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center p-6">
            {fetchStatus === "paused" ? (
              <Text>
                Keine Verbindung. Der Ladevorgang wird später fortgesetzt.
              </Text>
            ) : isLoading ? (
              <ActivityIndicator />
            ) : isError ? (
              <View className="items-center gap-3">
                <Text>{error.message}</Text>
                <Pressable onPress={() => void refetch()}>
                  <Text className="text-blue-600">Erneut versuchen</Text>
                </Pressable>
              </View>
            ) : (
              <Text>Keine Folgen gefunden.</Text>
            )}
          </View>
        }
      />
    </>
  );
}
