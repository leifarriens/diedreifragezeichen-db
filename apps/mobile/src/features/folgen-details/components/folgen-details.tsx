import { Icon } from "@expo/ui";
import { Link } from "expo-router";
import { Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useShallow } from "zustand/react/shallow";

import type { Folge } from "@/api/types";

import { Cover } from "@/components/cover";
import { UIButton } from "@/components/ui/button";
import dayjs, { formatDate } from "@/lib/date";
import { HapticFeedback } from "@/lib/haptic-feedback";
import { useFolgeStatus, useFolgeStore } from "@/stores/use-folge-store";

interface FolgeDetailsProps {
  folge: Folge;
}

export function FolgeDetails({ folge }: FolgeDetailsProps) {
  const { images, name, release_date } = folge;
  const { isBookmarked, isPlayed } = useFolgeStatus(folge._id);

  const { hasHydrated, toggleBookmark, togglePlayed } = useFolgeStore(
    useShallow((state) => ({
      hasHydrated: state.hasHydrated,
      toggleBookmark: state.toggleBookmark,
      togglePlayed: state.togglePlayed,
    })),
  );

  const isReleased = dayjs(release_date).isBefore(dayjs());
  const image = images.at(0);

  return (
    <View>
      <View className="px-5">
        {image && (
          <View className="mt-5">
            <Cover image={image} />
          </View>
        )}

        <View className="mt-3 flex-row items-center justify-between gap-3">
          <Link
            asChild
            href={`https://open.spotify.com/intl-de/album/${folge.spotify_id}`}
          >
            <UIButton icon="play" label="Play" />
          </Link>

          <View className="flex-row gap-3">
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
                      android:
                        import("@expo/material-symbols/bookmark_add.xml"),
                      ios: "bookmark",
                    })
              }
              iconOnly
              label={
                isBookmarked
                  ? "Lesezeichen entfernen"
                  : "Als Lesezeichen merken"
              }
              onPress={() => {
                HapticFeedback.button();
                toggleBookmark(folge._id);
              }}
            />
            <UIButton
              disabled={!hasHydrated}
              icon={
                isPlayed
                  ? Icon.select({
                      android:
                        import("@expo/material-symbols/check_circle.xml"),
                      ios: "checkmark.circle.fill",
                    })
                  : Icon.select({
                      android:
                        import("@expo/material-symbols/radio_button_unchecked.xml"),
                      ios: "checkmark.circle",
                    })
              }
              iconOnly
              label={
                isPlayed ? "Als ungehört markieren" : "Als gehört markieren"
              }
              onPress={() => {
                HapticFeedback.button();
                togglePlayed(folge._id);
              }}
            />
            {folge.weblink ? (
              <Link asChild href={folge.weblink}>
                <UIButton icon="network" />
              </Link>
            ) : null}
          </View>
        </View>
      </View>

      <Animated.View className="mt-5" entering={FadeInDown.delay(150)}>
        <View>
          <Text className="text-[20px] font-semibold text-white">
            Die drei ???
          </Text>
          <Text className="text-[34px] font-bold text-white">{name}</Text>
        </View>

        <View className="mt-3">
          <Text className="text-xl text-white">
            {isReleased ? "Veröffentlicht am" : "Wird veröffentlicht am"}{" "}
            {formatDate(release_date)}
          </Text>
          <Text className="text-xl text-white">
            {dayjs(release_date).fromNow()}
          </Text>
        </View>

        <View className="my-5">
          <Text className="text-3xl font-bold text-white">Inhalt</Text>
          <Text className="mt-2 text-justify text-lg text-white">
            {folge.inhalt}
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}
