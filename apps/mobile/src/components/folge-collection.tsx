import { useMemo } from "react";
import { ActivityIndicator, View } from "react-native";

import type { FolgeDetailPathname } from "@/components/folgen-list/folgen-list-item";
import type { SortOption } from "@/features/folgen/sort";

import { useFolgen } from "@/api/use-folgen";
import {
  FolgenList,
  type FolgenListProps,
} from "@/components/folgen-list/folgen-list";
import { createFolgenQuery } from "@/features/folgen/query";
import { useDebouncedValue } from "@/lib/use-debounced-value";
import { useFolgeStore } from "@/stores/use-folge-store";

interface FolgeCollectionProps extends Pick<
  FolgenListProps,
  "ListHeaderComponent"
> {
  emptyMessage: string;
  kind: "bookmarked" | "played";
  search: string;
  sortBy: SortOption;
}

export function FolgeCollection({
  emptyMessage,
  kind,
  ListHeaderComponent,
  search,
  sortBy,
}: FolgeCollectionProps) {
  const query = useFolgen();
  const debouncedSearch = useDebouncedValue(search);
  const ids = useFolgeStore((state) =>
    kind === "played" ? state.playedFolgeIds : state.bookmarkedFolgeIds,
  );
  const hasHydrated = useFolgeStore((state) => state.hasHydrated);

  const folgen = useMemo(() => {
    if (!query.data) return [];

    const idSet = new Set(ids);
    return query.data.filter((folge) => idSet.has(String(folge.id)));
  }, [ids, query.data]);

  const searchedFolgen = useMemo(
    () =>
      createFolgenQuery(folgen).search(debouncedSearch).sort(sortBy).results(),
    [folgen, debouncedSearch, sortBy],
  );

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

  return (
    <FolgenList
      detailPathname={detailPathname}
      emptyMessage={emptyMessage}
      folgen={searchedFolgen}
      ListHeaderComponent={ListHeaderComponent}
    />
  );
}
