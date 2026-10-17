import { Stack } from "expo-router/stack";

export default function GespeichertLayout() {
  return (
    <Stack
      screenOptions={{
        headerBackButtonDisplayMode: "minimal",
        headerLargeTitleEnabled: true,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="sign-in" options={{ title: "Sign in" }} />
    </Stack>
  );
}
