import { Stack } from "expo-router";
import { useState } from "react";

import type { CollectionSortOption } from "@/features/folgen/sort";

import { FolgeCollection } from "@/features/folgen/components/folge-collection";
import { headerSortMenu } from "@/features/folgen/header-sort-menu";
import { COLLECTION_SORT_OPTIONS } from "@/features/folgen/sort";

export default function GespeichertScreen() {
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
          title: "Gespeichert",
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
        emptyMessage="Noch keine Folgen gespeichert."
        kind="bookmarked"
        search={search}
        sortBy={sortBy}
        viewMode="list"
      />
    </>
  );
}
