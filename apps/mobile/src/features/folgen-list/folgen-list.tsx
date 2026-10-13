import type { FolgeWithCommunityRating } from "@ddfdb/core";

import { FlashList, type FlashListProps } from "@shopify/flash-list";
import { useCallback } from "react";
import { RefreshControl, Text, useWindowDimensions, View } from "react-native";

import { LoadingIndicator } from "@/components/ui/loading-indicator";

import type { FolgenListViewMode } from "./types";

import {
  type FolgeDetailPathname,
  FolgenListItem,
  type FolgenListItemProps,
} from "./folgen-list-item";

export interface FolgenListProps extends Pick<
  FlashListProps<FolgeWithCommunityRating>,
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
        <ListEmptyContainer>
          {isInitialLoading ? (
            <LoadingIndicator />
          ) : (
            <Text className="text-center text-xl font-semibold text-white">
              {emptyMessage ?? "Keine Folgen gefunden"}
            </Text>
          )}
        </ListEmptyContainer>
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

function ListEmptyContainer({ children }: { children: React.ReactNode }) {
  const { height } = useWindowDimensions();

  return (
    <View
      className="items-center justify-center px-16"
      style={{ height: height / 1.33 }}
    >
      {children}
    </View>
  );
}
