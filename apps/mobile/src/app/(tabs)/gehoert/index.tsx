import { Stack } from "expo-router";
import { useState } from "react";

import type { SortOption } from "@/features/folgen/sort";

import { PlayedFolgenProgress } from "@/components/played-folgen-progress";
import { FolgeCollection } from "@/features/folgen/components/folge-collection";
import { headerSortMenu } from "@/features/folgen/header-sort-menu";

export default function GehoertScreen() {
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
          title: "Gehört",
          unstable_headerRightItems: () =>
            headerSortMenu({ setSortBy, sortBy }),
        }}
      />

      <FolgeCollection
        emptyMessage="Noch keine Folgen als gehört markiert."
        kind="played"
        ListHeaderComponent={PlayedFolgenProgress}
        search={search}
        sortBy={sortBy}
      />
    </>
  );
}
