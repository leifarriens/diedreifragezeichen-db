import { useCallback } from "react";
import Animated, { LinearTransition } from "react-native-reanimated";

import type { Folge } from "@/api/types";

import { type FolgeDetailPathname, FolgenListItem } from "./folgen-list-item";

const archiveKeyExtractor = (item: Folge) => item._id;

export interface FolgenListProps extends Pick<
  React.ComponentProps<typeof Animated.FlatList>,
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
    <Animated.FlatList<Folge>
      className="flex-1"
      columnWrapperStyle={{ paddingHorizontal: 12 }}
      contentContainerClassName="gap-3 py-3"
      contentInsetAdjustmentBehavior="automatic"
      data={folgen}
      itemLayoutAnimation={LinearTransition}
      keyExtractor={archiveKeyExtractor}
      numColumns={2}
      renderItem={renderItem}
      {...rest}
    />
  );
}
