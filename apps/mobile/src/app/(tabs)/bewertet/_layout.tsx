import { Stack } from "expo-router/stack";

export default function RatedLayout() {
  return (
    <Stack
      screenOptions={{
        headerBackButtonDisplayMode: "minimal",
        headerLargeTitleEnabled: true,
      }}
    />
  );
}
