import type { EmailTransport } from "./email-transport";

type EmailOtpType =
  "change-email" | "email-verification" | "forget-password" | "sign-in";

const emailCopy: Record<EmailOtpType, { action: string; subject: string }> = {
  "change-email": {
    action: "confirm your email address",
    subject: "Confirm your DDFDB email address",
  },
  "email-verification": {
    action: "verify your email address",
    subject: "Verify your DDFDB email address",
  },
  "forget-password": {
    action: "reset your password",
    subject: "Your DDFDB password reset code",
  },
  "sign-in": {
    action: "sign in or create your DDFDB account",
    subject: "Your DDFDB sign-in code",
  },
};

export const OTP_LENGTH = 6;

export function createEmailOtpOptions(transport: EmailTransport) {
  return {
    allowedAttempts: 3,
    disableSignUp: false,
    expiresIn: 300,
    otpLength: OTP_LENGTH,
    rateLimit: { max: 3, window: 60 },
    resendStrategy: "reuse" as const,
    async sendVerificationOTP({
      email,
      otp,
      type,
    }: {
      email: string;
      otp: string;
      type: EmailOtpType;
    }) {
      const copy = emailCopy[type];
      const safeOtp = escapeHtml(otp);
      const text = [
        `Your DDFDB verification code is ${otp}.`,
        `Enter it to ${copy.action}.`,
        "This code expires in 5 minutes. If you did not request it, you can ignore this email.",
      ].join("\n\n");

      await transport.send({
        html: `<p>Your DDFDB verification code is:</p><p style="font-size: 24px; font-weight: 700; letter-spacing: 0.2em">${safeOtp}</p><p>Enter it to ${copy.action}. This code expires in 5 minutes.</p><p>If you did not request it, you can ignore this email.</p>`,
        subject: copy.subject,
        text,
        to: email,
      });
    },
    storeOTP: "encrypted" as const,
  };
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    switch (character) {
      case '"':
        return "&quot;";
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      default:
        return "&#39;";
    }
  });
}
