import { Text, useColorScheme, View } from "react-native";

import { useFolgenTotal } from "@/api/use-folgen";
import { PlayedFolgenProgressBar } from "@/components/played-folgen-progress-bar";
import { useFolgeStore } from "@/stores/use-folge-store";
import { DdfColors } from "@/Theme";

export function PlayedFolgenProgress() {
  const colorScheme = useColorScheme();
  const colors = DdfColors[colorScheme === "dark" ? "dark" : "light"];
  const playedCount = useFolgeStore((state) => state.playedFolgeIds.length);
  const hasHydrated = useFolgeStore((state) => state.hasHydrated);
  const totalQuery = useFolgenTotal();
  const totalCount = totalQuery.data;

  if (!hasHydrated || totalCount === undefined) return null;

  const progress = totalCount > 0 ? Math.min(playedCount / totalCount, 1) : 0;
  const percentage = (progress * 100).toFixed(0);

  return (
    <View
      className="mx-3 mb-1 gap-3 rounded-2xl p-4"
      style={{ backgroundColor: colors.surface }}
    >
      <Text className="font-semibold" style={{ color: colors.text }}>
        {playedCount === 0 && "Du hast noch keine Folgen gehört"}
        {playedCount === 1 && "Du hast bereits eine Folge gehört"}
        {playedCount > 1 &&
          `Du hast bereits ${playedCount.toString()} Folgen gehört`}
      </Text>
      <PlayedFolgenProgressBar progress={progress} />
      <View className="flex-row justify-between">
        <Text style={{ color: colors.secondaryText }}>{playedCount}</Text>
        <Text style={{ color: colors.secondaryText }}>{percentage}%</Text>
        <Text style={{ color: colors.secondaryText }}>{totalCount}</Text>
      </View>
    </View>
  );
}
