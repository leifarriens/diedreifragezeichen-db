import { Stack } from "expo-router";
import { useState } from "react";

import type { SortOption } from "@/features/folgen/sort";

import { FolgeCollection } from "@/features/folgen/components/folge-collection";
import { headerSortMenu } from "@/features/folgen/header-sort-menu";

export default function GespeichertScreen() {
  const [sortBy, setSortBy] = useState<SortOption>("dateDesc");
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
          unstable_headerRightItems: () =>
            headerSortMenu({ setSortBy, sortBy }),
        }}
      />

      <FolgeCollection
        emptyMessage="Noch keine Folgen gespeichert."
        kind="bookmarked"
        search={search}
        sortBy={sortBy}
      />
    </>
  );
}
