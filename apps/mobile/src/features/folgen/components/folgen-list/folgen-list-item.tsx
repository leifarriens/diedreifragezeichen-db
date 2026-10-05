import { Link } from "expo-router";
import { memo } from "react";
import { Pressable, Text, View } from "react-native";

import type { Folge } from "@/api/types";

import { formatDate } from "@/lib/date";

import type { FolgenListViewMode } from "./types";

import { Cover } from "../../../../components/cover";
import { formatFolgenSubtitle } from "../../format-folgen-subtitle";

export type FolgeDetailPathname =
  | "/(tabs)/(archiv)/[folgeId]"
  | "/(tabs)/gehoert/[folgeId]"
  | "/(tabs)/gespeichert/[folgeId]";

export interface FolgenListItemProps {
  detailPathname: FolgeDetailPathname;
  item: Folge;
  viewMode: FolgenListViewMode;
}

export const FolgenListItem = memo(
  function FolgenGridItem({
    detailPathname,
    item,
    viewMode,
  }: FolgenListItemProps) {
    const image = item.cover;

    if (viewMode === "grid") {
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
    }

    return (
      <Link
        asChild
        href={{ params: { folgeId: item.id }, pathname: detailPathname }}
      >
        <View className="flex-row gap-x-4 px-2 py-4">
          <Link.AppleZoom>
            <Pressable className="size-28">
              <Cover imageUrl={image} />
            </Pressable>
          </Link.AppleZoom>

          <View className="flex-1 py-2">
            <Text className="text-base text-white">
              {formatFolgenSubtitle(item.number)}
            </Text>
            <Text className="text-xl font-bold text-white">{item.title}</Text>
            <Text className="text-sm text-neutral-300">
              {item.release_date ? formatDate(item.release_date) : ""}
            </Text>
          </View>
        </View>
      </Link>
    );
  },
  (prev, next) => {
    return prev.item.id === next.item.id && prev.viewMode === next.viewMode;
  },
);
