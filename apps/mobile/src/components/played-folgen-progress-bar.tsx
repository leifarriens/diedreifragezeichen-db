import { useColorScheme, View } from "react-native";

import { DdfColors } from "@/Theme";

interface PlayedFolgenProgressBarProps {
  progress: number;
}

export function PlayedFolgenProgressBar({
  progress,
}: PlayedFolgenProgressBarProps) {
  const colorScheme = useColorScheme();
  const colors = DdfColors[colorScheme === "dark" ? "dark" : "light"];

  return (
    <View
      accessibilityLabel="Anteil gehörter Folgen"
      accessibilityValue={{ max: 100, min: 0, now: progress * 100 }}
      className="h-2 w-full overflow-hidden rounded-full"
      style={{ backgroundColor: colors.border }}
    >
      <View
        className="h-full rounded-full"
        style={{
          backgroundColor: colors.accent,
          width: `${(progress * 100).toString()}%`,
        }}
      />
    </View>
  );
}
