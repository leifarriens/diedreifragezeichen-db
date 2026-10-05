import { FlashList, type FlashListProps } from "@shopify/flash-list";
import { useCallback } from "react";
import { View } from "react-native";

import type { Folge } from "@/api/types";

import type { FolgenListViewMode } from "./types";

import { type FolgeDetailPathname, FolgenListItem } from "./folgen-list-item";

export interface FolgenListProps extends Pick<
  FlashListProps<Folge>,
  | "ListEmptyComponent"
  | "ListHeaderComponent"
  | "maintainVisibleContentPosition"
> {
  detailPathname: FolgeDetailPathname;
  emptyMessage?: string;
  folgen: Folge[];
  viewMode: FolgenListViewMode;
}

export function FolgenList({
  detailPathname,
  folgen,
  viewMode,
  ...rest
}: FolgenListProps) {
  const renderItem = useCallback(
    ({ item }: { item: Folge }) => (
      <FolgenListItem
        detailPathname={detailPathname}
        item={item}
        viewMode={viewMode}
      />
    ),
    [detailPathname, viewMode],
  );

  return (
    <FlashList<Folge>
      className="flex-1"
      contentContainerClassName="px-3 py-3"
      contentInsetAdjustmentBehavior="automatic"
      data={folgen}
      ItemSeparatorComponent={
        viewMode === "grid" ? FolgenListSeparator : undefined
      }
      key={viewMode}
      keyExtractor={archiveKeyExtractor}
      numColumns={viewMode === "grid" ? 2 : 1}
      renderItem={renderItem}
      {...rest}
    />
  );
}

const archiveKeyExtractor = (item: Folge) => String(item.id);

function FolgenListSeparator() {
  return <View className="h-3" />;
}
