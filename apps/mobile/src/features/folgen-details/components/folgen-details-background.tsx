import { BlurView } from "expo-blur";
import { StyleSheet } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import { AsyncImage } from "@/components/async-image";

export function BlurBackground({
  folgeId,
  imageUrl,
}: {
  folgeId: string;
  imageUrl: string;
}) {
  return (
    <Animated.View
      entering={FadeIn.delay(150).duration(500)}
      key={folgeId}
      style={StyleSheet.absoluteFill}
    >
      <AsyncImage style={StyleSheet.absoluteFill} uri={imageUrl} />
      <BlurView
        intensity={100}
        style={StyleSheet.absoluteFill}
        tint="systemThickMaterialDark"
      />
    </Animated.View>
  );
}
