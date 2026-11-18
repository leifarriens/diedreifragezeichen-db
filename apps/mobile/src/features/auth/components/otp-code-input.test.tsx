import { expect, it, vi } from "vitest";

vi.mock("react-native", () => ({
  Text: "Text",
  TextInput: "TextInput",
  View: "View",
}));

import { normalizeOtpCode } from "./otp-code-input";

it("keeps only digits and preserves leading zeroes", () => {
  expect(normalizeOtpCode("0a1-2 3", 6)).toBe("0123");
});

it("limits pasted codes to the configured length", () => {
  expect(normalizeOtpCode("123456789", 6)).toBe("123456");
});
