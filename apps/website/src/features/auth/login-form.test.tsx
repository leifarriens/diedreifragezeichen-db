// @vitest-environment jsdom

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
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
vi.mock("./components/otp-fieldt", () => ({
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

afterEach(cleanup);

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
  const form = screen.getByLabelText("Email").closest("form");
  if (!form) {
    throw new Error("Email form was not found");
  }

  fireEvent.submit(form);
}

describe("LoginForm", () => {
  it("sends a sign-in code to a normalized email and displays the code step", async () => {
    renderLoginForm();
    fireEvent.change(screen.getByLabelText("Email"), {
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
    fireEvent.change(screen.getByLabelText("Email"), {
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
    fireEvent.change(screen.getByLabelText("Email"), {
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
