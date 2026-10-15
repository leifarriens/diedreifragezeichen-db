import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack>
      {/* FIXME presentation: "modal" does not work here */}
      <Stack.Screen name="login" options={{ presentation: "modal" }} />
    </Stack>
  );
}
