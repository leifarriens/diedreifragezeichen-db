// @vitest-environment jsdom

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { refresh, replace, sendVerificationOtp, signInEmailOtp } = vi.hoisted(
  () => ({
    refresh: vi.fn(),
    replace: vi.fn(),
    sendVerificationOtp: vi.fn(),
    signInEmailOtp: vi.fn(),
  }),
);

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh, replace }),
}));
vi.mock("@/features/auth/auth-client", () => ({
  authClient: {
    emailOtp: { sendVerificationOtp },
    signIn: { emailOtp: signInEmailOtp },
  },
}));
vi.mock("./otp-fieldt", () => ({
  OTPField: ({
    onValueChange,
    onValueComplete,
    value,
  }: {
    onValueChange: (value: string) => void;
    onValueComplete: (value: string) => void;
    value: string;
  }) => (
    <input
      aria-label="Verification code"
      onChange={(event) => {
        const nextValue = event.currentTarget.value;
        onValueChange(nextValue);
        if (nextValue.length === 6) {
          onValueComplete(nextValue);
        }
      }}
      value={value}
    />
  ),
}));

import { LoginForm } from "./login-form";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

beforeEach(() => {
  vi.clearAllMocks();
  sendVerificationOtp.mockResolvedValue({ error: null });
  signInEmailOtp.mockResolvedValue({ error: null });
});

function renderLoginForm() {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <LoginForm />
    </QueryClientProvider>,
  );
}

function submitEmailForm() {
  const form = screen.getByLabelText("E-Mail").closest("form");
  if (!form) {
    throw new Error("Email form was not found");
  }

  fireEvent.submit(form);
}

describe("LoginForm", () => {
  it("disables resend for 60 seconds and restarts the countdown after sending", async () => {
    vi.useFakeTimers();
    renderLoginForm();
    fireEvent.change(screen.getByLabelText("E-Mail"), {
      target: { value: "listener@example.com" },
    });
    submitEmailForm();
    await act(() => vi.advanceTimersByTimeAsync(10));

    const resendButton = screen.getByRole<HTMLButtonElement>("button", {
      name: "Code erneut senden (60 s)",
    });
    expect(resendButton.disabled).toBe(true);
    fireEvent.click(resendButton);
    expect(sendVerificationOtp).toHaveBeenCalledTimes(1);

    act(() => {
      vi.advanceTimersByTime(60_000);
    });
    expect(resendButton.textContent).toBe("Code erneut senden");
    expect(resendButton.disabled).toBe(false);

    let resolveSend!: (result: { error: null }) => void;
    sendVerificationOtp.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveSend = resolve;
        }),
    );
    fireEvent.click(resendButton);
    await act(() => vi.advanceTimersByTimeAsync(10));
    expect(resendButton.disabled).toBe(true);
    expect(screen.getByLabelText("Verification code")).toBeTruthy();
    expect(screen.queryByLabelText("E-Mail")).toBeNull();

    await act(async () => {
      resolveSend({ error: null });
      await vi.advanceTimersByTimeAsync(10);
    });
    expect(sendVerificationOtp).toHaveBeenCalledTimes(2);
    expect(resendButton.textContent).toBe("Code erneut senden (60 s)");
    expect(resendButton.disabled).toBe(true);
  });

  it("keeps the code step on resend failure and allows retrying", async () => {
    vi.useFakeTimers();
    renderLoginForm();
    fireEvent.change(screen.getByLabelText("E-Mail"), {
      target: { value: "listener@example.com" },
    });
    submitEmailForm();
    await act(() => vi.advanceTimersByTimeAsync(10));
    fireEvent.change(screen.getByLabelText("Verification code"), {
      target: { value: "123" },
    });

    act(() => {
      vi.advanceTimersByTime(60_000);
    });
    sendVerificationOtp.mockResolvedValueOnce({
      error: { message: "Could not send code" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Code erneut senden" }));
    await act(() => vi.advanceTimersByTimeAsync(10));

    expect(screen.getByRole("alert").textContent).toContain(
      "Could not send code",
    );
    expect(
      screen.getByLabelText<HTMLInputElement>("Verification code").value,
    ).toBe("123");
    expect(
      screen.getByRole<HTMLButtonElement>("button", {
        name: "Code erneut senden",
      }).disabled,
    ).toBe(false);

    fireEvent.click(screen.getByRole("button", { name: "Code erneut senden" }));
    await act(() => vi.advanceTimersByTimeAsync(10));
    expect(
      screen.getByRole<HTMLButtonElement>("button", {
        name: "Code erneut senden (60 s)",
      }).disabled,
    ).toBe(true);
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("sends a sign-in code to a normalized email and displays the code step", async () => {
    renderLoginForm();
    fireEvent.change(screen.getByLabelText("E-Mail"), {
      target: { value: " Listener@Example.com " },
    });
    submitEmailForm();

    expect(await screen.findByLabelText("Verification code")).toBeTruthy();
    expect(sendVerificationOtp).toHaveBeenCalledExactlyOnceWith({
      email: "listener@example.com",
      type: "sign-in",
    });
  });

  it("verifies the OTP and redirects after a successful sign-in", async () => {
    renderLoginForm();
    fireEvent.change(screen.getByLabelText("E-Mail"), {
      target: { value: "listener@example.com" },
    });
    submitEmailForm();
    const codeInput = await screen.findByLabelText("Verification code");
    fireEvent.change(codeInput, { target: { value: "123456" } });

    await waitFor(() => {
      expect(signInEmailOtp).toHaveBeenCalledExactlyOnceWith({
        email: "listener@example.com",
        name: "listener",
        otp: "123456",
      });
      expect(replace).toHaveBeenCalledExactlyOnceWith("/profil");
      expect(refresh).toHaveBeenCalledOnce();
    });
  });

  it("shows invalid-code errors and lets users retry without redirecting", async () => {
    signInEmailOtp.mockResolvedValue({ error: { message: "Invalid OTP" } });
    renderLoginForm();
    fireEvent.change(screen.getByLabelText("E-Mail"), {
      target: { value: "listener@example.com" },
    });
    submitEmailForm();
    const codeInput = await screen.findByLabelText("Verification code");
    fireEvent.change(codeInput, { target: { value: "000000" } });

    const alert = await screen.findByRole("alert");
    expect(alert.textContent).toContain("Invalid OTP");
    expect(screen.getByLabelText("Verification code")).toBeTruthy();
    expect(replace).not.toHaveBeenCalled();
  });
});
