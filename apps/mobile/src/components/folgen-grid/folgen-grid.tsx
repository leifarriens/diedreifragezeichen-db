import { useCallback } from "react";
import Animated, { LinearTransition } from "react-native-reanimated";

import { Folge } from "@/api/types";

import { type FolgeDetailPathname, FolgenGridItem } from "./folgen-grid-item";

const archiveKeyExtractor = (item: Folge) => item._id;

export interface FolgenGridProps extends Pick<
  React.ComponentProps<typeof Animated.FlatList>,
  "ListEmptyComponent" | "ListHeaderComponent"
> {
  detailPathname: FolgeDetailPathname;
  emptyMessage?: string;
  folgen: Folge[];
}

export function FolgenGrid({
  detailPathname,
  folgen,
  ...rest
}: FolgenGridProps) {
  const renderItem = useCallback(
    ({ item }: { item: Folge }) => (
      <FolgenGridItem detailPathname={detailPathname} item={item} />
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
