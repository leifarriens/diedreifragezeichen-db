import { Stack } from "expo-router/stack";

export default function GehoertLayout() {
  return (
    <Stack
      screenOptions={{
        headerBackButtonDisplayMode: "minimal",
        headerLargeTitleEnabled: true,
      }}
    />
  );
}
