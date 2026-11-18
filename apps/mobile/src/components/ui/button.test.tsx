import { beforeEach, expect, it, vi } from "vitest";

const { modifiers, platform } = vi.hoisted(() => ({
  modifiers: {
    accessibilityLabel: vi.fn((label: string) => ({ label })),
    buttonBorderShape: vi.fn(() => ({})),
    buttonStyle: vi.fn(() => ({})),
    controlSize: vi.fn(() => ({})),
    labelStyle: vi.fn(() => ({})),
    tint: vi.fn(() => ({})),
  },
  platform: { OS: "ios" },
}));

vi.mock("@expo/ui", () => ({
  Button: "Button",
  Host: "Host",
  Icon: "Icon",
  Row: "Row",
  Text: "Text",
}));
vi.mock("@expo/ui/swift-ui/modifiers", () => modifiers);
vi.mock("react-native", () => ({ Platform: platform }));

import { UIButton } from "./button";

beforeEach(() => {
  platform.OS = "ios";
  vi.clearAllMocks();
});

it("uses accessibilityLabel to override the button label for icon-only buttons", () => {
  UIButton({
    accessibilityLabel: "Listen to this episode",
    icon: "play",
    iconOnly: true,
    label: "Play",
  });

  expect(modifiers.accessibilityLabel).toHaveBeenCalledWith(
    "Listen to this episode",
  );
});

it("uses the button label as the accessibility label by default", () => {
  UIButton({ icon: "play", iconOnly: true, label: "Play" });

  expect(modifiers.accessibilityLabel).toHaveBeenCalledWith("Play");
});
