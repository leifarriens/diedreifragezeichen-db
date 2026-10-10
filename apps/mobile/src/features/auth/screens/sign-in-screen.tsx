import { Stack, useRouter, useTheme } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  useColorScheme,
  View,
} from "react-native";

import { UIButton } from "@/components/ui/button";
import { authClient } from "@/features/auth/auth-client";
import { DdfColors } from "@/Theme";

type FormMode = "sign-in" | "sign-up";

export function SignInScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? DdfColors.dark : DdfColors.light;
  const [mode, setMode] = useState<FormMode>("sign-in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<null | string>(null);
  const [isPending, setIsPending] = useState(false);

  const inputStyle = {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderCurve: "continuous" as const,
    borderRadius: 12,
    borderWidth: 1,
    color: colors.text,
    fontSize: 16,
    minHeight: 52,
    paddingHorizontal: 14,
  };

  async function handleSubmit() {
    if (isPending) {
      return;
    }

    setError(null);
    setIsPending(true);

    try {
      const result =
        mode === "sign-in"
          ? await authClient.signIn.email({
              email: email.trim(),
              password,
            })
          : await authClient.signUp.email({
              email: email.trim(),
              name: name.trim(),
              password,
            });

      if (result.error) {
        setError(result.error.message ?? "Could not authenticate.");
        return;
      }

      router.replace("/(tabs)/settings");
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : "Could not authenticate.",
      );
    } finally {
      setIsPending(false);
    }
  }

  return (
    <>
      <Stack.Screen
        options={{ title: mode === "sign-in" ? "Sign in" : "Create account" }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            padding: 24,
          }}
          contentInsetAdjustmentBehavior="automatic"
          keyboardShouldPersistTaps="handled"
          style={{ backgroundColor: colors.background, flex: 1 }}
        >
          <View
            style={{
              alignSelf: "center",
              gap: 24,
              maxWidth: 440,
              width: "100%",
            }}
          >
            <View style={{ gap: 8 }}>
              <Text style={{ color: colors.text, fontSize: 17 }}>
                {mode === "sign-in"
                  ? "Sign in to your DDFDB account."
                  : "Create an account to get started."}
              </Text>
              <Text style={{ color: palette.secondaryText, fontSize: 15 }}>
                Browsing the archive does not require an account.
              </Text>
            </View>

            <View style={{ gap: 16 }}>
              {mode === "sign-up" && (
                <View style={{ gap: 8 }}>
                  <Text style={{ color: colors.text, fontSize: 15 }}>Name</Text>
                  <TextInput
                    accessibilityLabel="Name"
                    autoCapitalize="words"
                    autoComplete="name"
                    maxLength={100}
                    onChangeText={setName}
                    placeholder="Your name"
                    placeholderTextColor={palette.secondaryText}
                    returnKeyType="done"
                    style={inputStyle}
                    textContentType="name"
                    value={name}
                  />
                </View>
              )}

              <View style={{ gap: 8 }}>
                <Text style={{ color: colors.text, fontSize: 15 }}>Email</Text>
                <TextInput
                  accessibilityLabel="Email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect={false}
                  keyboardType="email-address"
                  onChangeText={setEmail}
                  placeholder="name@example.com"
                  placeholderTextColor={palette.secondaryText}
                  returnKeyType="done"
                  style={inputStyle}
                  textContentType="emailAddress"
                  value={email}
                />
              </View>

              <View style={{ gap: 8 }}>
                <Text style={{ color: colors.text, fontSize: 15 }}>
                  Password
                </Text>
                <TextInput
                  accessibilityLabel="Password"
                  autoCapitalize="none"
                  autoComplete={
                    mode === "sign-in" ? "current-password" : "new-password"
                  }
                  onChangeText={setPassword}
                  onSubmitEditing={() => void handleSubmit()}
                  placeholder="At least 8 characters"
                  placeholderTextColor={palette.secondaryText}
                  returnKeyType="done"
                  secureTextEntry
                  style={inputStyle}
                  textContentType={
                    mode === "sign-in" ? "password" : "newPassword"
                  }
                  value={password}
                />
              </View>
            </View>

            {error && (
              <Text
                accessibilityRole="alert"
                selectable
                style={{ color: palette.notification, fontSize: 14 }}
              >
                {error}
              </Text>
            )}

            <View style={{ alignItems: "center", gap: 16 }}>
              <UIButton
                disabled={isPending}
                intent="prominent"
                label={
                  isPending
                    ? "Please wait..."
                    : mode === "sign-in"
                      ? "Sign in"
                      : "Create account"
                }
                onPress={() => {
                  void handleSubmit();
                }}
              />
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ disabled: isPending }}
                disabled={isPending}
                onPress={() => {
                  setError(null);
                  setMode(mode === "sign-in" ? "sign-up" : "sign-in");
                }}
              >
                <Text style={{ color: colors.primary, fontSize: 15 }}>
                  {mode === "sign-in"
                    ? "New here? Create an account"
                    : "Already have an account? Sign in"}
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}
