import { useTheme } from "expo-router";
import { StyleSheet, View } from "react-native";

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
  const theme = useTheme();

  return (
    <View
      accessibilityLabel="Kein Cover verfügbar"
      accessibilityRole="image"
      style={[
        styles.cover,
        {
          backgroundColor: theme.colors.card,
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
