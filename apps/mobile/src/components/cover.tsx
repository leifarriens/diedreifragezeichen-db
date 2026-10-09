import { useTheme } from "expo-router";
import { StyleSheet, View } from "react-native";

import { OptimizedImage } from "./optimized-image";

interface CoverProps {
  imageUrl: null | string;
}

export function Cover({ imageUrl }: CoverProps) {
  if (!imageUrl) {
    return <CoverPlaceholder />;
  }

  return (
    <OptimizedImage
      imageUrl={imageUrl}
      placeholder={<CoverPlaceholder />}
      style={styles.cover}
    />
  );
}

function CoverPlaceholder() {
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
    width: "100%",
  },
});
