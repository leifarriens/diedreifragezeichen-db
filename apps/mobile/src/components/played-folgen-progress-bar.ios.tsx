import { Host } from "@expo/ui";
import { ProgressView } from "@expo/ui/swift-ui";
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
      seedColor={colors.accent}
      style={{ height: 24, width: "100%" }}
    >
      <ProgressView value={progress} />
    </Host>
  );
}
