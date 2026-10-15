import { afterEach, describe, expect, it, vi } from "vitest";

import { createEmailTransport } from "./email-transport";

const message = {
  html: "<p>123456</p>",
  subject: "Your DDFDB sign-in code",
  text: "Your code is 123456.",
  to: "listener@example.com",
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe("createEmailTransport", () => {
  it("logs email contents through the console transport outside production", async () => {
    const log = vi.fn();
    const sendWithResend = vi.fn();
    const transport = createEmailTransport({
      environment: "development",
      log,
      sendWithResend,
    });

    await transport.send(message);

    expect(log).toHaveBeenCalledExactlyOnceWith(
      "[email:console]\nTo: listener@example.com\nSubject: Your DDFDB sign-in code\n\nYour code is 123456.",
    );
    expect(sendWithResend).not.toHaveBeenCalled();
  });

  it("injects the Resend delivery in production", async () => {
    const sendWithResend = vi.fn().mockResolvedValue(undefined);
    const transport = createEmailTransport({
      environment: "production",
      resendApiKey: "test-api-key",
      resendFromEmail: "DDFDB <auth@example.com>",
      sendWithResend,
    });

    await transport.send(message);

    expect(sendWithResend).toHaveBeenCalledExactlyOnceWith(
      "test-api-key",
      { ...message, from: "DDFDB <auth@example.com>" },
    );
  });

  it("does not fall back to console in production when sender settings are missing", async () => {
    const log = vi.fn();
    const transport = createEmailTransport({
      environment: "production",
      log,
      resendApiKey: "test-api-key",
      resendFromEmail: "",
    });

    await expect(transport.send(message)).rejects.toThrow(
      "RESEND_API_KEY and RESEND_FROM_EMAIL are required",
    );
    expect(log).not.toHaveBeenCalled();
  });
});
