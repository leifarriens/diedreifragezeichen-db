import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

import { UIButton } from "@/components/ui/button";
import { DdfColors } from "@/Theme";

import { useSignIn } from "../hooks/use-auth";
import { OtpCodeInput } from "./otp-code-input";
import { ResendOtpButton } from "./resend-otp-button";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSentAt, setOtpSentAt] = useState<null | number>(null);

  const { otpRequestMutation, otpSigninMutation } = useSignIn();

  function handleEmailSubmit() {
    handleResendOtp();
  }

  function handleOtpComplete(code: string) {
    otpSigninMutation.mutate(
      { email, otp: code },
      {
        onError() {
          setOtp("");
        },
        onSuccess() {
          router.replace("/");
        },
      },
    );
  }

  function handleUseDifferentEmail() {
    setEmail("");
    setOtp("");
    setOtpSentAt(null);
    otpRequestMutation.reset();
    otpSigninMutation.reset();
  }

  function handleResendOtp() {
    otpRequestMutation.mutate(
      { email },
      {
        onSuccess: () => {
          setOtpSentAt(Date.now());
        },
      },
    );
  }

  const isPending = otpRequestMutation.isPending || otpSigninMutation.isPending;
  const error =
    otpRequestMutation.error?.message ?? otpSigninMutation.error?.message;

  if (otpSentAt === null) {
    return (
      <View className="w-full flex-1 gap-y-4">
        <Text className="text-center text-white">
          Beginne deine Anmeldung, indem du deine E-Mail-Adresse eingibst.
        </Text>
        <TextInput
          accessibilityLabel="Email"
          autoCapitalize="none"
          autoComplete="email"
          autoCorrect={false}
          className="rounded-xl border border-white p-4 text-white"
          keyboardType="email-address"
          onChangeText={setEmail}
          onSubmitEditing={handleEmailSubmit}
          placeholder="email@example.com"
          returnKeyType="go"
          style={{ fontSize: 18 }}
          textContentType="emailAddress"
          value={email}
        />
        {error && (
          <Text className="text-sm text-ddf-red" role="alert">
            {error}
          </Text>
        )}
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: isPending }}
          disabled={isPending}
          onPress={handleEmailSubmit}
          style={({ pressed }) => ({
            alignItems: "center",
            backgroundColor: DdfColors.dark.accent,
            borderRadius: 24,
            justifyContent: "center",
            minHeight: 48,
            opacity: isPending ? 0.5 : pressed ? 0.7 : 1,
            paddingHorizontal: 16,
          })}
        >
          <Text
            style={{
              color: DdfColors.dark.onAccent,
              fontSize: 16,
              fontWeight: "600",
            }}
          >
            Weiter
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="w-full gap-y-4">
      <Text className="text-center text-white">
        Gib den 6-stelligen Code ein, den wir an deine E-Mail-Adresse gesendet
        haben.
      </Text>
      <OtpCodeInput
        accessibilityHint="Gib den 6-stelligen Code aus deiner E-Mail ein."
        accessibilityLabel="Einmalcode"
        autoFocus
        disabled={isPending}
        onChangeText={setOtp}
        onComplete={handleOtpComplete}
        value={otp}
      />
      {error && (
        <Text className="text-sm text-ddf-red" role="alert">
          {error}
        </Text>
      )}

      <View className="flex flex-col items-center gap-y-4 text-sm">
        <ResendOtpButton
          disabled={isPending}
          onResend={handleResendOtp}
          sentAt={otpSentAt}
        />
        <UIButton
          disabled={isPending}
          intent="plain"
          onPress={handleUseDifferentEmail}
        >
          Andere E-Mail verwenden
        </UIButton>
      </View>
    </View>
  );
}
