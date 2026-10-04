import { useRouter } from "expo-router";
import { memo } from "react";
import { Pressable } from "react-native";

import { Folge } from "@/api/types";
import { HapticFeedback } from "@/lib/haptic-feedback";

import { Cover } from "../cover";

export type FolgeDetailPathname =
  | "/(tabs)/(archiv)/[folgeId]"
  | "/(tabs)/gehoert/[folgeId]"
  | "/(tabs)/gespeichert/[folgeId]";

export const FolgenGridItem = memo(function FolgenGridItem({
  detailPathname,
  item,
}: {
  detailPathname: FolgeDetailPathname;
  item: Folge;
}) {
  const router = useRouter();

  function handlePress() {
    router.push({
      params: { folgeId: item._id },
      pathname: detailPathname,
    });

    HapticFeedback.selection();
  }

  const image = item.images.at(1) ?? item.images.at(0);

  return (
    <Pressable
      className="gap-2 p-2"
      onPress={handlePress}
      style={{ flexGrow: 0, flexShrink: 0, width: "50%" }}
    >
      {image && <Cover image={image} />}
    </Pressable>
  );
});
