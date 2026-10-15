// @vitest-environment jsdom

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, cleanup, renderHook, waitFor } from "@testing-library/react";
import { createElement, type ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { createAuthHooks } from "./create-auth-hooks";

interface AuthResponse {
  error: null | { message: string };
}

const signInRequest = {
  email: "listener@example.com",
  type: "sign-in" as const,
};
const signIn = {
  email: "listener@example.com",
  name: "listener",
  otp: "123456",
};

afterEach(cleanup);

function setup() {
  const sendVerificationOtp = vi
    .fn<(input: typeof signInRequest) => Promise<AuthResponse>>()
    .mockResolvedValue({ error: null });
  const signInEmailOtp = vi
    .fn<(input: typeof signIn) => Promise<AuthResponse>>()
    .mockResolvedValue({ error: null });
  const hooks = createAuthHooks({
    emailOtp: { sendVerificationOtp },
    signIn: { emailOtp: signInEmailOtp },
  });
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
  const wrapper = ({ children }: { children: ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children);
  const hook = renderHook(() => hooks.useSignIn(), { wrapper });

  return { hook, sendVerificationOtp, signInEmailOtp };
}

describe("createAuthHooks", () => {
  it("requests an OTP using a normalized email address", async () => {
    const { hook, sendVerificationOtp } = setup();

    act(() => {
      hook.result.current.otpRequestMutation.mutate({
        email: " Listener@Example.com ",
      });
    });

    await waitFor(() => {
      expect(hook.result.current.otpRequestMutation.isSuccess).toBe(true);
    });
    expect(sendVerificationOtp).toHaveBeenCalledExactlyOnceWith(signInRequest);
  });

  it("surfaces OTP request errors as mutation errors", async () => {
    const { hook, sendVerificationOtp } = setup();
    sendVerificationOtp.mockResolvedValue({
      error: { message: "Could not send code" },
    });

    act(() => {
      hook.result.current.otpRequestMutation.mutate({
        email: "listener@example.com",
      });
    });

    await waitFor(() => {
      expect(hook.result.current.otpRequestMutation.error?.message).toBe(
        "Could not send code",
      );
    });
  });

  it("verifies an OTP using normalized email and code values", async () => {
    const { hook, signInEmailOtp } = setup();

    act(() => {
      hook.result.current.otpSigninMutation.mutate({
        email: " Listener@Example.com ",
        otp: " 123456 ",
      });
    });

    await waitFor(() => {
      expect(hook.result.current.otpSigninMutation.isSuccess).toBe(true);
    });
    expect(signInEmailOtp).toHaveBeenCalledExactlyOnceWith(signIn);
  });

  it("surfaces sign-in OTP errors as mutation errors", async () => {
    const { hook, signInEmailOtp } = setup();
    signInEmailOtp.mockResolvedValue({
      error: { message: "Invalid code" },
    });

    act(() => {
      hook.result.current.otpSigninMutation.mutate({
        email: "listener@example.com",
        otp: "000000",
      });
    });

    await waitFor(() => {
      expect(hook.result.current.otpSigninMutation.error?.message).toBe(
        "Invalid code",
      );
    });
  });
});
