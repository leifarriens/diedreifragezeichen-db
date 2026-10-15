import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, TextInput, View } from "react-native";

import { UIButton } from "@/components/ui/button";

import { useSignIn } from "../hooks/use-auth";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const { otpRequestMutation, otpSigninMutation } = useSignIn();

  function handleEmailSubmit() {
    otpRequestMutation.mutate({ email });
  }

  function handleOtpComplete() {
    otpSigninMutation.mutate(
      { email, otp },
      {
        onError() {
          setOtp("");
        },
        onSuccess() {
          router.navigate("/");
        },
      },
    );
  }

  function handleUseDifferentEmail() {
    setEmail("");
    otpRequestMutation.reset();
    otpSigninMutation.reset();
  }

  function handleResendOtp() {
    otpRequestMutation.mutate({ email });
  }

  const isPending = otpRequestMutation.isPending || otpSigninMutation.isPending;
  const error =
    otpRequestMutation.error?.message ?? otpSigninMutation.error?.message;

  const step = otpRequestMutation.isSuccess ? "otp" : "email";

  if (step === "email") {
    return (
      <View className="mt-48 flex-1 gap-y-4">
        <Text className="text-white">
          Gib deine E-Mail-Adresse ein um zu beginnen.
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
          placeholder="name@example.com"
          returnKeyType="go"
          textContentType="emailAddress"
          value={email}
        />
        {error && (
          <Text className="text-sm text-ddf-red" role="alert">
            {error}
          </Text>
        )}
        <UIButton
          disabled={isPending}
          label="Weiter"
          onPress={handleEmailSubmit}
        />
      </View>
    );
  }

  return (
    <View>
      <TextInput
        className="rounded-xl border border-white p-4 text-white"
        keyboardType="number-pad"
        onChangeText={setOtp}
        onSubmitEditing={handleOtpComplete}
        placeholder="Enter OTP"
        returnKeyType="go"
        value={otp}
      />
      {error && (
        <Text className="text-sm text-ddf-red" role="alert">
          {error}
        </Text>
      )}

      <View className="flex flex-col items-center gap-y-4 text-sm">
        <UIButton
          // className="font-medium text-ddf-blue-500 hover:underline disabled:opacity-60"
          disabled={isPending}
          intent="plain"
          onPress={handleResendOtp}
        >
          Code erneut senden
        </UIButton>
        <UIButton
          // className="font-medium text-ddf-blue-500 hover:underline"
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
