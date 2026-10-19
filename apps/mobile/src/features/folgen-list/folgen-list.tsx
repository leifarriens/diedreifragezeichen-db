import type { FolgenListItemWithUserData } from "@ddfdb/client";

import { l } from "@ddfdb/core/labels";
import { FlashList, type FlashListProps } from "@shopify/flash-list";
import { useCallback } from "react";
import { RefreshControl, Text } from "react-native";

import { LoadingIndicator } from "@/components/ui/loading-indicator";

import type { FolgenListViewMode } from "./types";

import { FolgenListEmptyContainer } from "./folgen-list-empty-container";
import {
  type FolgeDetailPathname,
  FolgenListItem,
  type FolgenListItemProps,
} from "./folgen-list-item";

export interface FolgenListProps extends Pick<
  FlashListProps<FolgenListItemWithUserData>,
  "ListHeaderComponent"
> {
  detailPathname: FolgeDetailPathname;
  emptyMessage: string | undefined;
  folgen: ListItem[];
  isInitialLoading: boolean;
  isRefreshing?: boolean;
  onRequestRefresh?: () => void;
  viewMode: FolgenListViewMode;
}

type ListItem = FolgenListItemProps["item"];

export function FolgenList({
  detailPathname,
  emptyMessage,
  folgen,
  isInitialLoading,
  isRefreshing = false,
  onRequestRefresh,
  viewMode,
  ...rest
}: FolgenListProps) {
  const renderItem = useCallback(
    ({ item }: { item: ListItem }) => (
      <FolgenListItem
        detailPathname={detailPathname}
        item={item}
        viewMode={viewMode}
      />
    ),
    [detailPathname, viewMode],
  );

  return (
    <FlashList<ListItem>
      className="flex-1"
      contentContainerClassName="px-3 py-3"
      contentInsetAdjustmentBehavior="automatic"
      data={folgen}
      key={viewMode}
      keyExtractor={archiveKeyExtractor}
      ListEmptyComponent={
        <FolgenListEmptyContainer>
          {isInitialLoading ? (
            <LoadingIndicator />
          ) : (
            <Text className="text-center text-xl font-semibold text-white">
              {emptyMessage ?? l.MISC.NO_FOLGEN_FOUND}
            </Text>
          )}
        </FolgenListEmptyContainer>
      }
      maintainVisibleContentPosition={{ disabled: true }}
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

const archiveKeyExtractor = (item: ListItem) => String(item.id);
