import { Stack } from "expo-router/stack";

export default function SettingsLayout() {
  return (
    <Stack
      screenOptions={{
        headerBackButtonDisplayMode: "minimal",
        headerLargeTitleEnabled: true,
      }}
    />
  );
}
