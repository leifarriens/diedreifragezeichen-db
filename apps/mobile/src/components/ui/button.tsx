import { Button, Host, Icon, Row, Text } from "@expo/ui";
import {
  accessibilityLabel as accessibilityLabelModifier,
  buttonBorderShape,
  buttonStyle,
  controlSize,
  labelStyle,
  type ModifierConfig,
  tint,
} from "@expo/ui/swift-ui/modifiers";
import { type ColorValue, Platform } from "react-native";

import type {
  NativeButtonIntent,
  NativeButtonStyle,
  UIButtonProps,
} from "./button.types";

export type { UIButtonProps } from "./button.types";

const intents: Record<
  NativeButtonIntent,
  {
    backgroundColor: ColorValue | undefined;
    variant: NativeButtonStyle;
  }
> = {
  default: {
    backgroundColor: undefined,
    variant: "glass",
  },
  prominent: {
    backgroundColor: undefined,
    variant: "glassProminent",
  },
} as const;

export function UIButton({
  accessibilityLabel,
  icon,
  iconColor,
  iconOnly = false,
  iconSize = 20,
  intent = "default",
  label,
  size = "large",
  tintColor,
  ...rest
}: UIButtonProps) {
  const modifiers: ModifierConfig[] = [
    controlSize(size),
    buttonStyle(intents[intent].variant),
  ];
  const seedColor = intents[intent].backgroundColor;

  if (icon && (!label || iconOnly)) {
    modifiers.push(labelStyle("iconOnly"), buttonBorderShape("circle"));
  }

  if (iconOnly && label && Platform.OS === "ios") {
    modifiers.push(accessibilityLabelModifier(accessibilityLabel ?? label));
  }

  if (tintColor) {
    modifiers.push(tint(tintColor));
  }

  return (
    <Host matchContents {...(seedColor === undefined ? {} : { seedColor })}>
      <Button modifiers={modifiers} {...rest}>
        <Row alignment="center" spacing={6}>
          {icon ? (
            <Icon
              {...(iconOnly && label !== undefined
                ? { accessibilityLabel: label }
                : {})}
              {...(iconColor === undefined ? {} : { color: iconColor })}
              name={icon}
              size={iconSize}
            />
          ) : null}
          {(!iconOnly || Platform.OS === "web") && label !== undefined && (
            <Text>{label}</Text>
          )}
        </Row>
      </Button>
    </Host>
  );
}
