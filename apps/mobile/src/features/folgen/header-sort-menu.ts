import type { NativeStackHeaderItem } from "expo-router";

import { type CollectionSortOption, SORT_OPTIONS } from "./sort";

export function headerSortMenu({
  options = SORT_OPTIONS,
  setSortBy,
  sortBy,
}: {
  options?: readonly { label: string; value: CollectionSortOption }[];
  setSortBy: (value: CollectionSortOption) => void;
  sortBy: CollectionSortOption;
}): NativeStackHeaderItem[] {
  return [
    {
      icon: { name: "arrow.up.arrow.down", type: "sfSymbol" },
      label: "Sortieren",
      menu: {
        items: options.map(({ label, value }) => ({
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
}
