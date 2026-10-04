import { Host } from "@expo/ui";
import { LinearProgressIndicator } from "@expo/ui/jetpack-compose";
import { useColorScheme } from "react-native";

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
    <Host
      accessibilityLabel="Anteil gehörter Folgen"
      style={{ height: 24, width: "100%" }}
    >
      <LinearProgressIndicator
        color={colors.accent}
        progress={progress}
        trackColor={colors.border}
      />
    </Host>
  );
}
