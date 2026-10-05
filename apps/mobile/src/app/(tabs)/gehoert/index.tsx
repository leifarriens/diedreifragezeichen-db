import { Stack } from "expo-router";
import { useState } from "react";

import type { CollectionSortOption } from "@/features/folgen/sort";

import { PlayedFolgenProgress } from "@/components/played-folgen-progress";
import { FolgeCollection } from "@/features/folgen/components/folge-collection";
import { headerSortMenu } from "@/features/folgen/header-sort-menu";
import { COLLECTION_SORT_OPTIONS } from "@/features/folgen/sort";

export default function GehoertScreen() {
  const [sortBy, setSortBy] = useState<CollectionSortOption>("addedAtDesc");
  const [search, setSearch] = useState("");

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
          title: "Gehört",
          unstable_headerRightItems: () => [
            ...headerSortMenu({
              options: COLLECTION_SORT_OPTIONS,
              setSortBy,
              sortBy,
            }),
          ],
        }}
      />

      <FolgeCollection
        emptyMessage="Noch keine Folgen als gehört markiert."
        kind="played"
        ListHeaderComponent={PlayedFolgenProgress}
        search={search}
        sortBy={sortBy}
        viewMode="list"
      />
    </>
  );
}
