import { Link } from "expo-router";
import { memo } from "react";
import { Pressable, Text, View } from "react-native";

import type { Folge } from "@/api/types";

import { formatDate } from "@/lib/date";

import { Cover } from "../../../../components/cover";

export type FolgeDetailPathname =
  | "/(tabs)/(archiv)/[folgeId]"
  | "/(tabs)/gehoert/[folgeId]"
  | "/(tabs)/gespeichert/[folgeId]";

export interface FolgenListItemProps {
  detailPathname: FolgeDetailPathname;
  item: Folge;
}

export const FolgenListItem = memo(function FolgenGridItem({
  detailPathname,
  item,
}: FolgenListItemProps) {
  const image = item.cover;

  return (
    <View className="mb-2 w-full gap-2 px-2">
      <Link
        asChild
        href={{ params: { folgeId: item.id }, pathname: detailPathname }}
      >
        <Link.AppleZoom>
          <Pressable>
            <Cover imageUrl={image} />
          </Pressable>
        </Link.AppleZoom>
      </Link>

      <View className="flex-row justify-between">
        {item.release_date ? (
          <View>
            <Text className="text-sm text-neutral-300">
              {formatDate(item.release_date)}
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
});
