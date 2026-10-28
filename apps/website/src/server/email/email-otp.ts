import type { EmailTransport } from "./email-transport";

type EmailOtpType =
  "change-email" | "email-verification" | "forget-password" | "sign-in";

const emailCopy: Record<EmailOtpType, { action: string; subject: string }> = {
  "change-email": {
    action: "deine neue E-Mail-Adresse zu bestätigen",
    subject: "Bestätige deine neue E-Mail-Adresse für DDFDB",
  },
  "email-verification": {
    action: "deine E-Mail-Adresse zu bestätigen",
    subject: "Bestätige deine E-Mail-Adresse bei DDFDB",
  },
  "forget-password": {
    action: "dein Passwort zurückzusetzen",
    subject: "Dein DDFDB-Code zum Zurücksetzen des Passworts",
  },
  "sign-in": {
    action: "dich anzumelden oder ein DDFDB-Konto zu erstellen",
    subject: "Dein DDFDB-Anmeldecode",
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
        `Dein DDFDB-Bestätigungscode lautet ${otp}.`,
        `Gib ihn ein, um ${copy.action}.`,
        "Dieser Code ist 5 Minuten gültig. Wenn du ihn nicht angefordert hast, kannst du diese E-Mail ignorieren.",
      ].join("\n\n");

      await transport.send({
        html: `<p>Dein DDFDB-Bestätigungscode lautet:</p><p style="font-size: 24px; font-weight: 700; letter-spacing: 0.2em">${safeOtp}</p><p>Gib ihn ein, um ${copy.action}. Dieser Code ist 5 Minuten gültig.</p><p>Wenn du ihn nicht angefordert hast, kannst du diese E-Mail ignorieren.</p>`,
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
