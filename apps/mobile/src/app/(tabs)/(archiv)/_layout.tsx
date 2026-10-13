import { Stack } from "expo-router/stack";

import { ArchiveFilterProvider } from "@/features/archive/context/archive-filter-provider";

export default function DashboardStackLayout() {
  return (
    <ArchiveFilterProvider>
      <Stack
        screenOptions={{
          headerBackButtonDisplayMode: "minimal",
          headerTransparent: true,
        }}
      >
        {/* <Stack.Screen name="index" />

        <Stack.Screen name="[folgeId]" /> */}

        <Stack.Screen
          name="filter"
          options={{
            contentStyle: { backgroundColor: "transparent" },
            presentation: "formSheet",
            sheetAllowedDetents: [0.5, 1],
            title: "Filter",
          }}
        />
      </Stack>
    </ArchiveFilterProvider>
  );
}
