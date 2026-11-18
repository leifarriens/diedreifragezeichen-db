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
  const deleteUser = vi
    .fn<() => Promise<AuthResponse>>()
    .mockResolvedValue({ error: null });
  const signOut = vi
    .fn<() => Promise<AuthResponse>>()
    .mockResolvedValue({ error: null });
  const hooks = createAuthHooks({
    deleteUser,
    emailOtp: { sendVerificationOtp },
    signIn: { emailOtp: signInEmailOtp },
    signOut,
  });
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
  const wrapper = ({ children }: { children: ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children);
  return {
    deleteUser,
    hooks,
    queryClient,
    sendVerificationOtp,
    signInEmailOtp,
    signOut,
    wrapper,
  };
}

describe("createAuthHooks", () => {
  it("requests an OTP using a normalized email address", async () => {
    const { hooks, sendVerificationOtp, wrapper } = setup();
    const hook = renderHook(() => hooks.useSignIn(), { wrapper });

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
    const { hooks, sendVerificationOtp, wrapper } = setup();
    const hook = renderHook(() => hooks.useSignIn(), { wrapper });
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
    const { hooks, signInEmailOtp, wrapper } = setup();
    const hook = renderHook(() => hooks.useSignIn(), { wrapper });

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
    const { hooks, signInEmailOtp, wrapper } = setup();
    const hook = renderHook(() => hooks.useSignIn(), { wrapper });
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

  it("signs out and clears the query cache when settled", async () => {
    const { hooks, queryClient, signOut, wrapper } = setup();
    const clear = vi.spyOn(queryClient, "clear");
    const hook = renderHook(() => hooks.useSignOut(), { wrapper });

    await act(async () => {
      await hook.result.current.mutateAsync();
    });

    expect(signOut).toHaveBeenCalledExactlyOnceWith();
    expect(clear).toHaveBeenCalledExactlyOnceWith();
  });

  it("surfaces account deletion errors and clears the query cache", async () => {
    const { deleteUser, hooks, queryClient, wrapper } = setup();
    deleteUser.mockResolvedValue({
      error: { message: "Could not delete account" },
    });
    const clear = vi.spyOn(queryClient, "clear");
    const hook = renderHook(() => hooks.useDeleteAccount(), { wrapper });

    await act(async () => {
      await expect(hook.result.current.mutateAsync()).rejects.toThrow(
        "Could not delete account. If your session has expired, sign out and sign back in before trying again.",
      );
    });

    expect(deleteUser).toHaveBeenCalledExactlyOnceWith();
    expect(clear).toHaveBeenCalledExactlyOnceWith();
  });
});
