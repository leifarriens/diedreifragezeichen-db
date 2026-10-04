import { Stack } from "expo-router/stack";

import { ArchiveFilterProvider } from "@/providers/archive-filter-provider";

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
            presentation: "formSheet",
            sheetAllowedDetents: [0.5],
            title: "Filter",
          }}
        />
      </Stack>
    </ArchiveFilterProvider>
  );
}
