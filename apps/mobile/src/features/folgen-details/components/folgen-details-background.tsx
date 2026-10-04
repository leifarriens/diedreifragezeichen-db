import { BlurView } from "expo-blur";
import { StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";

import type { FolgeImage } from "@/api/types";

export function BlurBackground({
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
