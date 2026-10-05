import { useMemo } from "react";
import { ActivityIndicator, View } from "react-native";

import type { FolgeDetailPathname } from "@/features/folgen/components/folgen-list/folgen-list-item";
import type { CollectionSortOption } from "@/features/folgen/sort";

import { useFolgen } from "@/api/use-folgen";
import {
  FolgenList,
  type FolgenListProps,
} from "@/features/folgen/components/folgen-list/folgen-list";
import { createFolgenQuery } from "@/features/folgen/query";
import { sortFolgenByAddedAt } from "@/features/folgen/sort";
import { useDebouncedValue } from "@/lib/use-debounced-value";
import { useFolgeStore } from "@/stores/use-folge-store";

interface FolgeCollectionProps extends Pick<
  FolgenListProps,
  "ListHeaderComponent" | "viewMode"
> {
  emptyMessage: string;
  kind: "bookmarked" | "played";
  search: string;
  sortBy: CollectionSortOption;
}

export function FolgeCollection({
  emptyMessage,
  kind,
  ListHeaderComponent,
  search,
  sortBy,
  viewMode,
}: FolgeCollectionProps) {
  const query = useFolgen();
  const debouncedSearch = useDebouncedValue(search);
  const savedFolgen = useFolgeStore((state) =>
    kind === "played" ? state.playedFolgen : state.bookmarkedFolgen,
  );
  const hasHydrated = useFolgeStore((state) => state.hasHydrated);

  const folgen = useMemo(() => {
    if (!query.data) return [];

    const idSet = new Set(savedFolgen.map((folge) => folge.folgeId));
    return query.data.filter((folge) => idSet.has(String(folge.id)));
  }, [query.data, savedFolgen]);

  const searchedFolgen = useMemo(() => {
    const query = createFolgenQuery(folgen).search(debouncedSearch);

    if (sortBy === "addedAtAsc" || sortBy === "addedAtDesc") {
      const addedAtById = new Map(
        savedFolgen.map(({ addedAt, folgeId }) => [folgeId, addedAt]),
      );
      const direction = sortBy === "addedAtAsc" ? 1 : -1;
      return sortFolgenByAddedAt(query.results(), addedAtById, direction);
    }

    return query.sort(sortBy).results();
  }, [folgen, debouncedSearch, savedFolgen, sortBy]);

  if (!hasHydrated) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </View>
    );
  }

  const detailPathname: FolgeDetailPathname =
    kind === "played"
      ? "/(tabs)/gehoert/[folgeId]"
      : "/(tabs)/gespeichert/[folgeId]";

  // Keep the viewport fixed when sorting reorders existing list items.
  return (
    <FolgenList
      detailPathname={detailPathname}
      emptyMessage={emptyMessage}
      folgen={searchedFolgen}
      ListHeaderComponent={ListHeaderComponent}
      maintainVisibleContentPosition={{ disabled: true }}
      viewMode={viewMode}
    />
  );
}
