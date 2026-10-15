import { describe, expect, it, vi } from "vitest";

import type { EmailTransport } from "./email-transport";

import { createEmailOtpOptions } from "./email-otp";

describe("createEmailOtpOptions", () => {
  it("injects email delivery and configures automatic OTP sign-up", async () => {
    const send = vi.fn<EmailTransport["send"]>().mockResolvedValue(undefined);
    const transport: EmailTransport = { send };
    const options = createEmailOtpOptions(transport);

    await options.sendVerificationOTP({
      email: "listener@example.com",
      otp: "123456",
      type: "sign-in",
    });

    expect(options).toMatchObject({
      allowedAttempts: 3,
      disableSignUp: false,
      expiresIn: 300,
      otpLength: 6,
      rateLimit: { max: 3, window: 60 },
      resendStrategy: "reuse",
      storeOTP: "encrypted",
    });
    expect(send).toHaveBeenCalledOnce();
    const message = send.mock.calls[0]?.[0];
    expect(message?.html).toContain("123456");
    expect(message?.subject).toBe("Your DDFDB sign-in code");
    expect(message?.text).toContain("sign in or create your DDFDB account");
    expect(message?.to).toBe("listener@example.com");
  });

  it("escapes code content before putting it in HTML", async () => {
    const send = vi.fn<EmailTransport["send"]>().mockResolvedValue(undefined);
    const options = createEmailOtpOptions({ send });

    await options.sendVerificationOTP({
      email: "listener@example.com",
      otp: "<123&>",
      type: "sign-in",
    });

    expect(send).toHaveBeenCalledOnce();
    expect(send.mock.calls[0]?.[0].html).toContain("&lt;123&amp;&gt;");
  });
});
