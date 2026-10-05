import { useTheme } from "expo-router";
import { View } from "react-native";

interface PlayedFolgenProgressBarProps {
  progress: number;
}

export function PlayedFolgenProgressBar({
  progress,
}: PlayedFolgenProgressBarProps) {
  const theme = useTheme();

  return (
    <View
      accessibilityLabel="Anteil gehörter Folgen"
      accessibilityValue={{ max: 100, min: 0, now: progress * 100 }}
      className="h-2 w-full overflow-hidden rounded-full"
      style={{ backgroundColor: theme.colors.border }}
    >
      <View
        className="h-full rounded-full"
        style={{
          backgroundColor: theme.colors.primary,
          width: `${(progress * 100).toString()}%`,
        }}
      />
    </View>
  );
}
