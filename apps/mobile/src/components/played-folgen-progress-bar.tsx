import { Host } from "@expo/ui";
import { ProgressView } from "@expo/ui/swift-ui";
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
      seedColor={theme.colors.primary}
      style={{ height: 24, width: "100%" }}
    >
      <ProgressView value={progress} />
    </Host>
  );
}
