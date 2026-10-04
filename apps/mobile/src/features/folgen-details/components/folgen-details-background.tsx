import { BlurView } from "expo-blur";
import { StyleSheet, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import { AsyncImage } from "@/components/async-image";

const AnimatedAsyncImage = Animated.createAnimatedComponent(AsyncImage);

export function BlurBackground({
  folgeId,
  imageUrl,
}: {
  folgeId: string;
  imageUrl: string;
}) {
  return (
    <View style={StyleSheet.absoluteFill}>
      <AnimatedAsyncImage
        entering={FadeIn}
        sharedTransitionTag={`folge-${folgeId}`}
        style={StyleSheet.absoluteFill}
        uri={imageUrl}
      />
      <BlurView
        intensity={100}
        style={StyleSheet.absoluteFill}
        tint="systemMaterialDark"
      />
    </View>
  );
}
