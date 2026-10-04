import { Stack } from "expo-router/stack";

export default function GespeichertLayout() {
  return (
    <Stack
      screenOptions={{
        headerBackButtonDisplayMode: "minimal",
        headerLargeTitleEnabled: true,
      }}
    >
      <Stack.Screen name="index" options={{ title: "Gespeichert" }} />
      <Stack.Screen name="[folgeId]" />
    </Stack>
  );
}
