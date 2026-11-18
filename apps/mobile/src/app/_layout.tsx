import "../global.css";

import { Stack, ThemeProvider } from "expo-router";
import { useColorScheme } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { QueryProvider } from "../providers/query-provider";
import { DdfDarkTheme, DdfDefaultTheme } from "../Theme";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <QueryProvider>
      <ThemeProvider
        value={colorScheme === "dark" ? DdfDarkTheme : DdfDefaultTheme}
      >
        <SafeAreaProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen
              name="login"
              options={{
                headerShown: true,
                headerTitle: "",
                headerTransparent: true,
                presentation: "modal",
              }}
            />

            <Stack.Screen name="(tabs)" />
          </Stack>
        </SafeAreaProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}
