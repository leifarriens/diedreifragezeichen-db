import { Stack, useRouter, useTheme } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
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

type SignInStep = "email" | "otp";

export function SignInScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const colorScheme = useColorScheme();
  const palette = colorScheme === "dark" ? DdfColors.dark : DdfColors.light;
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<SignInStep>("email");
  const [error, setError] = useState<null | string>(null);
  const [isPending, setIsPending] = useState(false);
  const hasValidOtp = /^\d{6}$/.test(otp.trim());

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

  async function requestCode() {
    if (isPending) {
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    setEmail(normalizedEmail);
    setError(null);
    setIsPending(true);

    try {
      const result = await authClient.emailOtp.sendVerificationOtp({
        email: normalizedEmail,
        type: "sign-in",
      });

      if (result.error) {
        setError(result.error.message ?? "Could not send a sign-in code.");
        return;
      }

      setOtp("");
      setStep("otp");
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : "Could not send a sign-in code.",
      );
    } finally {
      setIsPending(false);
    }
  }

  async function handleOtpSubmit() {
    if (isPending || !hasValidOtp) {
      return;
    }

    setError(null);
    setIsPending(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();
      const result = await authClient.signIn.emailOtp({
        email: normalizedEmail,
        name: normalizedEmail.split("@")[0] ?? normalizedEmail,
        otp: otp.trim(),
      });

      if (result.error) {
        setError(result.error.message ?? "Could not verify the sign-in code.");
        return;
      }

      router.replace("/(tabs)/settings");
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Could not verify the sign-in code.",
      );
    } finally {
      setIsPending(false);
    }
  }

  return (
    <>
      <Stack.Screen options={{ title: "Sign in" }} />
      <KeyboardAvoidingView
        behavior={process.env.EXPO_OS === "ios" ? "padding" : undefined}
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
                {step === "email"
                  ? "Sign in or create an account."
                  : "Check your email."}
              </Text>
              <Text style={{ color: palette.secondaryText, fontSize: 15 }}>
                {step === "email"
                  ? "Enter your email and we’ll send you a one-time code. New accounts are created after you verify your email."
                  : "Enter the six-digit code sent to your email address."}
              </Text>
              <Text style={{ color: palette.secondaryText, fontSize: 15 }}>
                Browsing the archive does not require an account.
              </Text>
            </View>

            {step === "email" ? (
              <View style={{ gap: 16 }}>
                <View style={{ gap: 8 }}>
                  <Text style={{ color: colors.text, fontSize: 15 }}>Email</Text>
                  <TextInput
                    accessibilityLabel="Email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect={false}
                    keyboardType="email-address"
                    onChangeText={setEmail}
                    onSubmitEditing={() => void requestCode()}
                    placeholder="name@example.com"
                    placeholderTextColor={palette.secondaryText}
                    returnKeyType="go"
                    style={inputStyle}
                    textContentType="emailAddress"
                    value={email}
                  />
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
                <UIButton
                  disabled={isPending}
                  intent="prominent"
                  label={isPending ? "Sending code..." : "Send code"}
                  onPress={() => void requestCode()}
                />
              </View>
            ) : (
              <View style={{ gap: 16 }}>
                <View style={{ gap: 8 }}>
                  <Text style={{ color: colors.text, fontSize: 15 }}>
                    Verification code
                  </Text>
                  <TextInput
                    accessibilityLabel="Verification code"
                    autoCapitalize="none"
                    autoComplete="one-time-code"
                    autoFocus
                    keyboardType="number-pad"
                    maxLength={6}
                    onChangeText={setOtp}
                    onSubmitEditing={() => void handleOtpSubmit()}
                    placeholder="123456"
                    placeholderTextColor={palette.secondaryText}
                    returnKeyType="go"
                    style={{ ...inputStyle, letterSpacing: 8, textAlign: "center" }}
                    textContentType="oneTimeCode"
                    value={otp}
                  />
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
                    disabled={isPending || !hasValidOtp}
                    intent="prominent"
                    label={isPending ? "Verifying..." : "Continue"}
                    onPress={() => void handleOtpSubmit()}
                  />
                  <View
                    style={{
                      alignItems: "center",
                      flexDirection: "row",
                      gap: 24,
                    }}
                  >
                    <Pressable
                      accessibilityRole="button"
                      accessibilityState={{ disabled: isPending }}
                      disabled={isPending}
                      onPress={() => {
                        setError(null);
                        setOtp("");
                        setStep("email");
                      }}
                    >
                      <Text style={{ color: colors.primary, fontSize: 15 }}>
                        Change email
                      </Text>
                    </Pressable>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityState={{ disabled: isPending }}
                      disabled={isPending}
                      onPress={() => void requestCode()}
                    >
                      <Text style={{ color: colors.primary, fontSize: 15 }}>
                        Resend code
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}
