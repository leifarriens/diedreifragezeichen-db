import { Stack } from "expo-router";
import { ScrollView } from "react-native";

import { LoginForm } from "../components/login-form";

export function LoginScreen() {
  return (
    <>
      <Stack.Screen />

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5"
        contentInsetAdjustmentBehavior="automatic"
      >
        <LoginForm />
      </ScrollView>
    </>
  );
}
