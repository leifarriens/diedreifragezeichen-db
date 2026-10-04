import { StyleSheet, useColorScheme, View } from "react-native";

import { DdfColors } from "@/Theme";

import { AsyncImage } from "./async-image";

interface CoverProps {
  imageUrl: null | string;
}

export function Cover({ imageUrl }: CoverProps) {
  if (!imageUrl) {
    return <ImagePlaceholder />;
  }

  return (
    <AsyncImage
      placeholder={<ImagePlaceholder />}
      style={styles.cover}
      uri={imageUrl}
    />
  );
}

function ImagePlaceholder() {
  const colorScheme = useColorScheme();

  return (
    <View
      accessibilityLabel="Kein Cover verfügbar"
      accessibilityRole="image"
      style={[
        styles.cover,
        {
          backgroundColor:
            colorScheme === "dark"
              ? DdfColors.dark.surface
              : DdfColors.light.surface,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  cover: {
    aspectRatio: 1,
    borderRadius: 14,
    width: "100%" as const,
  },
});
