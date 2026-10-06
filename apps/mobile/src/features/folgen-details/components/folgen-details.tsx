import {
  formatFolgenSubtitle,
  formatRelativeTime,
  formatReleaseDate,
  isDateBeforeNow,
} from "@ddfdb/core";
import { Icon } from "@expo/ui";
import { Link } from "expo-router";
import { Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useShallow } from "zustand/react/shallow";

import type { Folge } from "@/api/types";

import { Cover } from "@/components/cover";
import { UIButton } from "@/components/ui/button";
import { HapticFeedback } from "@/lib/haptic-feedback";
import { useFolgeStatus, useFolgeStore } from "@/stores/use-folge-store";

import { isExternalHref } from "../is-external-href";
import { FolgenPlayButton } from "./folgen-play-button";

interface FolgeDetailsProps {
  folge: Folge;
}

export function FolgeDetails({ folge }: FolgeDetailsProps) {
  const { cover, links, number, release_date, title } = folge;
  const { isBookmarked, isPlayed } = useFolgeStatus(String(folge.id));

  const { hasHydrated, toggleBookmark, togglePlayed } = useFolgeStore(
    useShallow((state) => ({
      hasHydrated: state.hasHydrated,
      toggleBookmark: state.toggleBookmark,
      togglePlayed: state.togglePlayed,
    })),
  );

  const isReleased = release_date !== null && isDateBeforeNow(release_date);

  return (
    <View>
      <View className="px-5">
        <Cover imageUrl={cover} />
      </View>

      <View className="mt-5 items-center">
        <Text className="text-[20px] font-semibold text-white">
          {formatFolgenSubtitle(number)}
        </Text>

        <Text className="text-center text-[34px] font-bold text-white">
          {title}
        </Text>

        {release_date ? (
          <Text className="text-base text-neutral-300">
            {isReleased ? "Veröffentlicht am" : "Wird veröffentlicht am"}{" "}
            {formatReleaseDate(release_date)} •{" "}
            {formatRelativeTime(release_date)}
          </Text>
        ) : null}
      </View>

      <View className="mt-6 flex-row items-center justify-between gap-3">
        <View className="flex-row gap-2">
          <UIButton
            disabled={!hasHydrated}
            icon={
              isBookmarked
                ? Icon.select({
                    android:
                      import("@expo/material-symbols/bookmark_added.xml"),
                    ios: "bookmark.fill",
                  })
                : Icon.select({
                    android: import("@expo/material-symbols/bookmark_add.xml"),
                    ios: "bookmark",
                  })
            }
            iconOnly
            label={
              isBookmarked ? "Lesezeichen entfernen" : "Als Lesezeichen merken"
            }
            onPress={() => {
              HapticFeedback.button();
              toggleBookmark(String(folge.id));
            }}
          />
          <UIButton
            disabled={!hasHydrated}
            icon={
              isPlayed
                ? Icon.select({
                    android: import("@expo/material-symbols/check_circle.xml"),
                    ios: "checkmark.circle.fill",
                  })
                : Icon.select({
                    android:
                      import("@expo/material-symbols/radio_button_unchecked.xml"),
                    ios: "checkmark.circle",
                  })
            }
            iconOnly
            intent="prominent"
            label={isPlayed ? "Als ungehört markieren" : "Als gehört markieren"}
            onPress={() => {
              HapticFeedback.button();
              togglePlayed(String(folge.id));
            }}
            tintColor={isPlayed ? "green" : "transparent"}
          />

          {folge.weblink && isExternalHref(folge.weblink) ? (
            <Link asChild href={folge.weblink} target="_blank">
              <UIButton icon="network" />
            </Link>
          ) : null}
        </View>

        <FolgenPlayButton links={links} />
      </View>

      {folge.description ? (
        <Animated.View className="mt-6" entering={FadeInDown.delay(150)}>
          <Text className="text-3xl font-bold text-white">Inhalt</Text>
          <Text className="mt-2 text-base text-white">{folge.description}</Text>
        </Animated.View>
      ) : null}
    </View>
  );
}
