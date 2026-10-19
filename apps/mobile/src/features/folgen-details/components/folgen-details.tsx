import type { Folge } from "@ddfdb/archiv/contracts";

import {
  formatFolgenSubtitle,
  formatRelativeTime,
  formatReleaseDate,
  isReleasDateInThePast,
} from "@ddfdb/core";
import { Link } from "expo-router";
import { Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { Cover } from "@/components/cover";
import { UIButton } from "@/components/ui/button";
import { FolgenBookmarkButton } from "@/features/bookmarks/folgen-bookmark-button";
import { useUserBookmarks } from "@/features/bookmarks/use-bookmarks";
import { FolgenListenedButton } from "@/features/listened/folgen-listened-button";
import { useUserListened } from "@/features/listened/use-listened";
import { FolgenRatingButton } from "@/features/ratings/folgen-rating-button";

import { isExternalHref } from "../is-external-href";
import { FolgenPlayButton } from "./folgen-play-button";

interface FolgeDetailsProps {
  folge: Folge;
}

export function FolgeDetails({ folge }: FolgeDetailsProps) {
  const {
    authors,
    cover,
    number,
    release_date,
    script_authors,
    streaming,
    title,
    voice_roles,
  } = folge;
  const { data: userBookmarks } = useUserBookmarks();
  const { data: userListened } = useUserListened();

  const isReleased = isReleasDateInThePast(release_date);

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

      <View className="mt-6 flex flex-row items-center justify-center gap-2">
        <FolgenBookmarkButton
          folgeId={folge.id}
          folgeTitle={folge.title}
          isBookmarked={
            userBookmarks?.some((bookmark) => bookmark.folgeId === folge.id) ??
            false
          }
        />
        <FolgenListenedButton
          folgeId={folge.id}
          folgeTitle={folge.title}
          hasListened={
            userListened?.some((listened) => listened.folgeId === folge.id) ??
            false
          }
        />

        <FolgenRatingButton folgeId={folge.id} />

        {folge.weblink && isExternalHref(folge.weblink) ? (
          <Link asChild href={folge.weblink} target="_blank">
            <UIButton icon="network" iconOnly />
          </Link>
        ) : null}

        <FolgenPlayButton streaming={streaming} />
      </View>

      <View className="mt-6 gap-y-6">
        {folge.description ? (
          <Animated.View className="mt-6" entering={FadeInDown.delay(150)}>
            <Text className="text-3xl font-bold text-white">Inhalt</Text>
            <Text className="mt-2 text-base text-white">
              {folge.description}
            </Text>
          </Animated.View>
        ) : null}

        {voice_roles.length > 0 && (
          <View className="text-lg">
            <Text className="text-3xl font-bold text-white">Sprechrollen</Text>
            <Text className="text-mask-b-to-transparent mt-2 text-white">
              {voice_roles.map(({ role, speaker }) => `${role}: ${speaker}\n`)}
            </Text>
          </View>
        )}

        {(authors.length > 0 || script_authors.length > 0) && (
          <View className="text-lg">
            <Text className="text-3xl font-bold text-white">Autoren</Text>
            {authors.length > 0 ? (
              <Text className="mt-2 text-white">
                Buch: {authors.join(", ")}
              </Text>
            ) : null}
            {script_authors.length > 0 ? (
              <Text className="mt-2 text-white">
                Drehbuch: {script_authors.join(", ")}
              </Text>
            ) : null}
          </View>
        )}
      </View>
    </View>
  );
}
