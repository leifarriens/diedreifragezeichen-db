import { useTheme } from "expo-router";
import { Text, View } from "react-native";

import { useFolgenTotal } from "@/api/use-folgen";
import { PlayedFolgenProgressBar } from "@/components/played-folgen-progress-bar";
import { useUserListened } from "@/features/listened/use-listened";
import { useAuth } from "@/lib/use-auth";

export function PlayedFolgenProgress() {
  const theme = useTheme();
  const { isAuthenticated } = useAuth();
  const { data: userListened } = useUserListened();
  const playedCount = userListened?.length ?? 0;
  const totalQuery = useFolgenTotal();
  const totalCount = totalQuery.data;

  if (
    !isAuthenticated ||
    userListened === undefined ||
    totalCount === undefined
  ) {
    return null;
  }

  const progress = totalCount > 0 ? Math.min(playedCount / totalCount, 1) : 0;
  const percentage = (progress * 100).toFixed(0);

  return (
    <View
      className="mx-3 mb-5 gap-3 rounded-2xl p-4"
      style={{ backgroundColor: theme.colors.card }}
    >
      <Text className="font-semibold" style={{ color: theme.colors.text }}>
        {playedCount === 0 && "Du hast noch keine Folgen gehört"}
        {playedCount === 1 && "Du hast bereits eine Folge gehört"}
        {playedCount > 1 &&
          `Du hast bereits ${playedCount.toString()} Folgen gehört`}
      </Text>
      <PlayedFolgenProgressBar progress={progress} />
      <View className="flex-row justify-between">
        <Text className="text-neutral-300">{playedCount}</Text>
        <Text className="text-neutral-300">{percentage}%</Text>
        <Text className="text-neutral-300">{totalCount}</Text>
      </View>
    </View>
  );
}
