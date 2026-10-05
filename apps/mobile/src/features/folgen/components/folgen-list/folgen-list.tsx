import { FlashList, type FlashListProps } from "@shopify/flash-list";
import { useCallback } from "react";
import { View } from "react-native";

import type { Folge } from "@/api/types";

import { type FolgeDetailPathname, FolgenListItem } from "./folgen-list-item";

export interface FolgenListProps extends Pick<
  FlashListProps<Folge>,
  "ListEmptyComponent" | "ListHeaderComponent"
> {
  detailPathname: FolgeDetailPathname;
  emptyMessage?: string;
  folgen: Folge[];
}

export function FolgenList({
  detailPathname,
  folgen,
  ...rest
}: FolgenListProps) {
  const renderItem = useCallback(
    ({ item }: { item: Folge }) => (
      <FolgenListItem detailPathname={detailPathname} item={item} />
    ),
    [detailPathname],
  );

  return (
    <FlashList<Folge>
      className="flex-1"
      contentContainerClassName="px-3 py-3"
      contentInsetAdjustmentBehavior="automatic"
      data={folgen}
      ItemSeparatorComponent={FolgenListSeparator}
      keyExtractor={archiveKeyExtractor}
      numColumns={2}
      renderItem={renderItem}
      {...rest}
    />
  );
}

const archiveKeyExtractor = (item: Folge) => String(item.id);

function FolgenListSeparator() {
  return <View className="h-3" />;
}
