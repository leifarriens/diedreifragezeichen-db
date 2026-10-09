import type { FolgeWithCommunityRating } from "@ddfdb/core";

import { FlashList, type FlashListProps } from "@shopify/flash-list";
import { useCallback } from "react";
import { RefreshControl, View } from "react-native";

import type { FolgenListViewMode } from "./types";

import { type FolgeDetailPathname, FolgenListItem } from "./folgen-list-item";

export interface FolgenListProps extends Pick<
  FlashListProps<FolgeWithCommunityRating>,
  | "ListEmptyComponent"
  | "ListHeaderComponent"
  | "maintainVisibleContentPosition"
> {
  detailPathname: FolgeDetailPathname;
  emptyMessage?: string;
  folgen: FolgeWithCommunityRating[];
  isRefreshing?: boolean;
  onRequestRefresh?: () => void;
  viewMode: FolgenListViewMode;
}

export function FolgenList({
  detailPathname,
  folgen,
  isRefreshing = false,
  onRequestRefresh,
  viewMode,
  ...rest
}: FolgenListProps) {
  const renderItem = useCallback(
    ({ item }: { item: FolgeWithCommunityRating }) => (
      <FolgenListItem
        detailPathname={detailPathname}
        item={item}
        viewMode={viewMode}
      />
    ),
    [detailPathname, viewMode],
  );

  return (
    <FlashList<FolgeWithCommunityRating>
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
      refreshControl={
        onRequestRefresh && (
          <RefreshControl
            onRefresh={onRequestRefresh}
            refreshing={isRefreshing}
          />
        )
      }
      renderItem={renderItem}
      {...rest}
    />
  );
}

const archiveKeyExtractor = (item: FolgeWithCommunityRating) => String(item.id);

function FolgenListSeparator() {
  return <View className="h-3" />;
}
