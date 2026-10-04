import { Stack } from "expo-router/stack";

export default function DashboardStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerBackButtonDisplayMode: "minimal",
        headerTransparent: true,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="[folgeId]" />
    </Stack>
  );
}
