"use client";

import { useRouter } from "next/navigation";
import { type SyntheticEvent, useState } from "react";

import { Button } from "@/components/ui/button/button";
import { Input } from "@/components/ui/input/input";
import { OTP_LENGTH } from "@/server/email/email-otp";

import { useSignIn } from "../hooks/use-auth";
import { OTPField } from "./otp-fieldt";
import { ResendOtpButton } from "./resend-otp-button";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSentAt, setOtpSentAt] = useState<null | number>(null);

  const { otpRequestMutation, otpSigninMutation } = useSignIn();

  function handleEmailSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    handleResendOtp();
  }

  function handleOtpComplete(otp: string) {
    otpSigninMutation.mutate(
      { email, otp },
      {
        onError() {
          setOtp("");
        },
        onSuccess() {
          router.replace("/profil");
          router.refresh();
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
      <form className="space-y-4" onSubmit={handleEmailSubmit}>
        <p className="text-sm text-neutral-300">
          Gib deine E-Mail-Adresse ein um zu beginnen.
        </p>
        <Input
          autoCapitalize="none"
          autoComplete="email"
          className="w-full"
          label="E-Mail"
          name="email"
          onChange={(event) => {
            setEmail(event.currentTarget.value);
          }}
          placeholder="email@example.com"
          required
          type="email"
          value={email}
        />
        {error && (
          <p className="text-sm text-ddf-red" role="alert">
            {error}
          </p>
        )}
        <Button
          className="w-full"
          intent="primary"
          isLoading={isPending}
          type="submit"
        >
          Weiter
        </Button>
      </form>
    );
  }

  return (
    <div>
      <div className="flex justify-center">
        <OTPField
          disabled={isPending}
          length={OTP_LENGTH}
          onValueChange={setOtp}
          onValueComplete={handleOtpComplete}
          value={otp}
        />
      </div>
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      <div className="mt-8 flex flex-col items-center gap-y-4 text-sm">
        <ResendOtpButton
          disabled={isPending}
          onResend={handleResendOtp}
          sentAt={otpSentAt}
        />
        <button
          className="font-medium text-ddf-blue-500 hover:underline"
          disabled={isPending}
          onClick={handleUseDifferentEmail}
          type="button"
        >
          Andere E-Mail verwenden
        </button>
      </div>
    </div>
  );
}
