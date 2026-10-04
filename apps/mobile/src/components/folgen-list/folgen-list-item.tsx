import { useRouter } from "expo-router";
import { memo } from "react";
import { Pressable, Text, View } from "react-native";

import type { Folge } from "@/api/types";

import { formatDate } from "@/lib/date";
import { HapticFeedback } from "@/lib/haptic-feedback";

import { Cover } from "../cover";

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
  const router = useRouter();

  function handlePress() {
    router.push({
      params: { folgeId: item.id },
      pathname: detailPathname,
    });

    HapticFeedback.selection();
  }

  const image = item.cover;

  return (
    <View className="mb-2 w-1/2 shrink-0 grow-0 gap-1 px-2">
      <Pressable onPress={handlePress}>
        <Cover imageUrl={image} />
      </Pressable>

      {item.release_date ? (
        <View>
          <Text className="text-sm text-neutral-300">
            {formatDate(item.release_date)}
          </Text>
          <Text className="text-sm text-neutral-300">{item.id}</Text>
        </View>
      ) : null}
    </View>
  );
});
