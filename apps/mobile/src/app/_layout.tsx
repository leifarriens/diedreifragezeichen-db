import "../global.css";

import { Stack, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useColorScheme } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { QueryProvider } from "../providers/query-provider";
import { DdfDarkTheme, DdfDefaultTheme } from "../Theme";

void SplashScreen.preventAutoHideAsync();

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
              name="auth/login"
              options={{ animation: "none", headerShown: false }}
            />

            <Stack.Screen name="(tabs)" />
          </Stack>
        </SafeAreaProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}
