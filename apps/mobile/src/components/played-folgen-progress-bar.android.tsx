import { Host } from "@expo/ui";
import { LinearProgressIndicator } from "@expo/ui/jetpack-compose";
import { useTheme } from "expo-router";

interface PlayedFolgenProgressBarProps {
  progress: number;
}

export function PlayedFolgenProgressBar({
  progress,
}: PlayedFolgenProgressBarProps) {
  const theme = useTheme();

  return (
    <Host
      accessibilityLabel="Anteil gehörter Folgen"
      style={{ height: 24, width: "100%" }}
    >
      <LinearProgressIndicator
        color={theme.colors.primary}
        progress={progress}
        trackColor={theme.colors.border}
      />
    </Host>
  );
}
