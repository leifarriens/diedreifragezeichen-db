import { Image } from "expo-image";
import { Link, Stack } from "expo-router";
import { useMemo, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";

import type { Folge } from "@/api/types";

import { useFolgen } from "@/api/use-folgen";
import logo from "@/assets/logo.png";
import { Cover } from "@/components/cover";
import { UISwitch } from "@/components/ui/switch";
import dayjs from "@/lib/date";

type SortOption = "dateAsc" | "dateDesc" | "popularity" | "rating";

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: "Neuste", value: "dateDesc" },
  { label: "Älteste", value: "dateAsc" },
  // { label: "Beste", value: "rating" },
  // { label: "Beliebteste", value: "popularity" },
];

const AnimatedCover = Animated.createAnimatedComponent(Cover);

const archiveKeyExtractor = (item: Folge | null) =>
  item?._id ?? "archive-grid-spacer";

export default function ArchivScreen() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("dateDesc");
  const [showSpecials, setShowSpecials] = useState(false);
  const query = useFolgen();
  const { error, fetchStatus, isError, isLoading, refetch } = query;

  const episodes = useMemo(
    () =>
      query.data
        ? sortFolgen(
            filterByQuery(filterSpecials(query.data, showSpecials), search),
            sortBy,
          )
        : undefined,
    [query.data, search, showSpecials, sortBy],
  );

  const gridItems = useMemo(
    () =>
      episodes
        ? [...episodes, ...(episodes.length % 2 === 1 ? [null] : [])]
        : [],
    [episodes],
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
          unstable_headerRightItems: () => [
            {
              icon: { name: "arrow.up.arrow.down", type: "sfSymbol" },
              label: "Sortieren",
              menu: {
                items: SORT_OPTIONS.map(({ label, value }) => ({
                  label,
                  onPress: () => {
                    setSortBy(value);
                  },
                  state: sortBy === value ? ("on" as const) : ("off" as const),
                  type: "action" as const,
                })),
                title: "Sortieren nach",
              },
              type: "menu",
            },
          ],
        }}
      />

      <Animated.FlatList<Folge | null>
        className="flex-1"
        columnWrapperStyle={{ gap: 12, paddingHorizontal: 12 }}
        contentContainerClassName="gap-3 py-3"
        contentInsetAdjustmentBehavior="automatic"
        data={gridItems}
        itemLayoutAnimation={LinearTransition}
        keyExtractor={archiveKeyExtractor}
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
        ListHeaderComponent={
          <View className="px-6 flex-row justify-end text-center">
            <UISwitch
              label="Specials Anzeigen"
              onValueChange={setShowSpecials}
              value={showSpecials}
            />
          </View>
        }
        numColumns={2}
        renderItem={({ item }) => {
          if (!item) {
            return <View className="flex-1" />;
          }

          const image = item.images.at(1) ?? item.images.at(0);

          return (
            <Link
              asChild
              href={{
                params: { folgeId: item._id },
                pathname: "/(tabs)/archiv/[folgeId]",
              }}
            >
              <View className="flex-1 gap-2 p-2">
                {image && <AnimatedCover image={image} />}
              </View>
            </Link>
          );
        }}
      />
    </>
  );
}

function filterByQuery(folgen: Folge[], searchQuery: string) {
  const queryPattern = new RegExp(searchQuery, "i");

  return folgen.filter((folge) => {
    if (queryPattern.exec(folge.name.concat(folge.number))) {
      return true;
    }

    return dayjs(folge.release_date).year().toString() === searchQuery;
  });
}

function filterSpecials(folgen: Folge[], showSpecials: boolean) {
  return showSpecials
    ? folgen
    : folgen.filter((folge) => folge.type !== "special");
}

function sortFolgen(folgen: Folge[], sortBy: SortOption) {
  const sorted = [...folgen];

  switch (sortBy) {
    case "dateAsc":
      return sorted.sort(
        (a, b) =>
          new Date(a.release_date).getTime() -
          new Date(b.release_date).getTime(),
      );
    case "dateDesc":
      return sorted
        .sort(
          (a, b) =>
            new Date(a.release_date).getTime() -
            new Date(b.release_date).getTime(),
        )
        .reverse();
    case "popularity":
      return sorted.sort((a, b) => a.popularity - b.popularity).reverse();
    case "rating":
      return sorted.sort((a, b) => a.rating - b.rating).reverse();
  }
}
