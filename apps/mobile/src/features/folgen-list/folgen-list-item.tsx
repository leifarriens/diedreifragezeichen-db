import type { FolgenListItemWithUserData } from "@ddfdb/client";

import { formatReleaseDate } from "@ddfdb/core";
import { formatFolgenSubtitle } from "@ddfdb/core";
import { Link } from "expo-router";
import { memo } from "react";
import { Pressable, Text, View } from "react-native";

import { Cover } from "@/components/cover";
import { FolgenRatingDisplay } from "@/features/ratings/folgen-rating-display";

import type { FolgenListViewMode } from "./types";

export type FolgeDetailPathname =
  | "/(tabs)/(archiv)/[folgeId]"
  | "/(tabs)/bewertet/[folgeId]"
  | "/(tabs)/gehoert/[folgeId]"
  | "/(tabs)/gespeichert/[folgeId]";

export interface FolgenListItemProps {
  detailPathname: FolgeDetailPathname;
  item: FolgenListItemWithUserData;
  viewMode: FolgenListViewMode;
}

export const FolgenListItem = memo(function FolgenGridItem({
  detailPathname,
  item: folge,
  viewMode,
}: FolgenListItemProps) {
  if (viewMode === "grid") {
    return (
      <View className="mb-4 w-full gap-2 px-2">
        <Link
          asChild
          href={{ params: { folgeId: folge.id }, pathname: detailPathname }}
        >
          <Link.AppleZoom>
            <Pressable>
              <Cover imageUrl={folge.cover} />
            </Pressable>
          </Link.AppleZoom>
        </Link>

        <View className="flex-row justify-between">
          <View>
            <FolgenRatingDisplay
              folgenTitle={folge.title}
              size="sm"
              type="community"
              value={folge.communityRating?.score ?? null}
            />
            {folge.release_date ? (
              <View>
                <Text className="text-sm text-neutral-300">
                  {formatReleaseDate(folge.release_date)}
                </Text>
              </View>
            ) : null}
          </View>

          <View>
            {folge.userRating !== null ? (
              <FolgenRatingDisplay
                folgenTitle={folge.title}
                size="sm"
                type="user"
                value={folge.userRating}
              />
            ) : null}
          </View>
        </View>
      </View>
    );
  }

  return (
    <Link
      asChild
      href={{ params: { folgeId: folge.id }, pathname: detailPathname }}
    >
      <Pressable className="flex-row gap-x-4 px-2 py-4">
        <Link.AppleZoom>
          <View className="size-28" collapsable={false}>
            <Cover imageUrl={folge.cover} />
          </View>
        </Link.AppleZoom>

        <View className="flex-1 py-2">
          <Text className="text-base text-white">
            {formatFolgenSubtitle(folge.number)}
          </Text>
          <Text className="text-xl font-bold text-white">{folge.title}</Text>
          <Text className="text-sm text-neutral-300">
            {folge.release_date ? formatReleaseDate(folge.release_date) : ""}
          </Text>
        </View>
      </Pressable>
    </Link>
  );
});
