import { useTheme } from "expo-router";
import { useEffect } from "react";
import { Pressable, Text } from "react-native";

import { cn } from "@/lib/cn";

import type { UIButtonProps } from "./button.types";

const buttonHeights = {
  extraLarge: 56,
  large: 48,
  mini: 28,
  regular: 40,
  small: 32,
} as const;

export function UIButton({
  accessibilityLabel,
  children,
  disabled = false,
  hidden = false,
  iconColor,
  iconSize = 20,
  intent = "default",
  label,
  onAppear,
  onDisappear,
  onPress,
  size = "large",
  style,
  testID,
  tintColor,
}: UIButtonProps) {
  const { colors } = useTheme();

  useEffect(() => {
    onAppear?.();
    return () => onDisappear?.();
  }, [onAppear, onDisappear]);

  if (hidden) {
    return null;
  }

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel ?? label ?? "Link öffnen"}
      accessibilityRole="button"
      className={cn(
        "flex-row items-center justify-center gap-1.5 rounded-full border px-3",
        {
          "opacity-50": disabled,
        },
      )}
      disabled={disabled}
      onPress={onPress}
      style={[
        {
          backgroundColor:
            intent === "prominent"
              ? typeof tintColor === "string" || typeof tintColor === "number"
                ? tintColor
                : colors.primary
              : colors.card,
          borderColor: colors.border,
          height: buttonHeights[size],
          minWidth: buttonHeights[size],
        },
        style,
      ]}
      testID={testID}
    >
      {children ?? (
        <Text
          className=""
          style={{
            color: iconColor ?? colors.text,
            fontSize: label ? 16 : iconSize,
            fontWeight: "600",
          }}
        >
          {label ?? "↗"}
        </Text>
      )}
    </Pressable>
  );
}
