import { Stack, useRouter } from "expo-router";
import { ScrollView, Text, View } from "react-native";

import { LoginForm } from "../components/login-form";

export function LoginScreen() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen
        options={{
          unstable_headerRightItems: () => [
            {
              icon: { name: "xmark", type: "sfSymbol" },
              label: "Dismiss",
              onPress() {
                router.dismiss();
              },
              type: "button",
            },
          ],
        }}
      />

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5"
        contentInsetAdjustmentBehavior="automatic"
      >
        <View className="mt-48 w-full items-center">
          <Text className="mb-12 text-5xl font-bold text-white">Anmelden</Text>
          <LoginForm />
        </View>
      </ScrollView>
    </>
  );
}
