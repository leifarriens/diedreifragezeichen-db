import { BlurView } from "expo-blur";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { Folge, FolgeImage } from "@/api/types";
import { useFolge } from "@/api/use-folge";
import { Cover } from "@/components/cover";
import { UIButton } from "@/components/ui/button";
import dayjs, { DATE_FORMAT } from "@/lib/date";

export default function FolgeDetailScreen() {
  const { folgeId } = useLocalSearchParams<{ folgeId: string }>();
  const folgeQuery = useFolge(folgeId);

  if (folgeQuery.isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!folgeQuery.data || folgeQuery.isError) {
    return <Text>Error loading folge.</Text>;
  }

  const folge = folgeQuery.data;
  const backgroundImage = folge.images.at(-1) ?? folge.images.at(0);

  return (
    <>
      <Stack.Screen
        options={{
          headerTransparent: true,
          title: "",
        }}
      />

      {backgroundImage && (
        <BlurBackground folgeId={folge._id} image={backgroundImage} />
      )}

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-8 pb-20 relative"
        contentInsetAdjustmentBehavior="automatic"
      >
        <FolgeDetails folge={folge} />
      </ScrollView>
    </>
  );
}

function BlurBackground({
  folgeId,
  image,
}: {
  folgeId: string;
  image: FolgeImage;
}) {
  return (
    <View style={StyleSheet.absoluteFill}>
      <Animated.Image
        resizeMode="cover"
        sharedTransitionTag={`folge-${folgeId}`}
        source={{ uri: image.url }}
        style={StyleSheet.absoluteFill}
      />
      <BlurView
        intensity={100}
        style={StyleSheet.absoluteFill}
        tint="systemMaterialDark"
      />
    </View>
  );
}

function FolgeDetails({ folge }: { folge: Folge }) {
  const { images, name, release_date } = folge;
  const isReleased = dayjs(release_date).isBefore(dayjs());
  const image = images.at(0);

  return (
    <View>
      <View className="px-5">
        {image && (
          <View className="pt-5">
            <Cover image={image} />
          </View>
        )}

        <View className="flex-col gap-3 items-center my-5 justify-between">
          <Link
            asChild
            href={`https://open.spotify.com/intl-de/album/${folge.spotify_id}`}
          >
            <UIButton icon="play" label="Play" />
          </Link>

          <View className="flex-row gap-3">
            <UIButton icon="plus.app" size="regular" />
            <UIButton icon="checkmark" size="regular" />
            {folge.weblink ? (
              <Link asChild href={folge.weblink}>
                <UIButton icon="network" size="regular" />
              </Link>
            ) : null}
          </View>
        </View>
      </View>

      <Animated.View entering={FadeInDown.delay(150)}>
        <View>
          <Text className="text-[20px] font-semibold text-white">
            Die drei ???
          </Text>
          <Text className="text-[34px] font-bold text-white">{name}</Text>
        </View>

        <View className="mt-3">
          <Text className="text-xl text-white">
            {isReleased ? "Veröffentlicht am" : "Wird veröffentlicht am"}{" "}
            {dayjs(release_date).format(DATE_FORMAT)}
          </Text>
          <Text className="text-xl text-white">
            {dayjs(release_date).fromNow()}
          </Text>
        </View>

        <View className="my-5">
          <Text className="text-white text-3xl font-bold">Inhalt</Text>
          <Text className="text-lg text-justify text-white mt-2">
            {folge.inhalt}
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}
