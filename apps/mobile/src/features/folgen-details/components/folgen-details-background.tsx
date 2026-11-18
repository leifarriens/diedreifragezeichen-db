import { BlurView } from "expo-blur";
import { StyleSheet } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import { OptimizedImage } from "@/components/optimized-image";

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
      <OptimizedImage
        imageSize={64}
        imageUrl={imageUrl}
        style={StyleSheet.absoluteFill}
      />
      <BlurView
        intensity={100}
        style={StyleSheet.absoluteFill}
        tint="systemMaterial"
      />
    </Animated.View>
  );
}
