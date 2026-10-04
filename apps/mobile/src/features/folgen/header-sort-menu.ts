import type { NativeStackHeaderItem } from "expo-router";

import { SORT_OPTIONS, type SortOption } from "./sort";

export const headerSortMenu = ({
  setSortBy,
  sortBy,
}: {
  setSortBy: (value: SortOption) => void;
  sortBy: SortOption;
}): NativeStackHeaderItem[] => [
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
];
