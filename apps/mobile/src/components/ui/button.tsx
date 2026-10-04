import type { ButtonProps, IconName } from "@expo/ui";

import { Button, Host, Icon, Row, Text } from "@expo/ui";
import {
  accessibilityLabel,
  buttonBorderShape,
  buttonStyle,
  controlSize,
  labelStyle,
  type ModifierConfig,
  tint,
} from "@expo/ui/swift-ui/modifiers";
import { type ColorValue, Platform } from "react-native";

export interface UIButtonProps extends Omit<
  ButtonProps,
  "modifiers" | "variant"
> {
  icon?: IconName;
  iconColor?: ColorValue | undefined;
  iconOnly?: boolean;
  iconSize?: number;
  intent?: NativeButtonIntent;
  size?: Parameters<typeof controlSize>[0];
  tintColor?: Parameters<typeof tint>[0];
}

type NativeButtonIntent = "default" | "prominent";

const intents: Record<
  NativeButtonIntent,
  {
    backgroundColor: ColorValue | undefined;
    variant: Parameters<typeof buttonStyle>[0];
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

  if (icon && (!label || iconOnly)) {
    modifiers.push(labelStyle("iconOnly"), buttonBorderShape("circle"));
  }

  if (iconOnly && label && Platform.OS === "ios") {
    modifiers.push(accessibilityLabel(label));
  }

  if (tintColor) {
    modifiers.push(tint(tintColor));
  }

  return (
    <Host matchContents seedColor={intents[intent].backgroundColor}>
      <Button modifiers={modifiers} {...rest}>
        <Row alignment="center" spacing={6}>
          {icon ? (
            <Icon
              accessibilityLabel={iconOnly ? label : undefined}
              color={iconColor}
              name={icon}
              size={iconSize}
            />
          ) : null}
          {(!iconOnly || Platform.OS === "web") && <Text>{label}</Text>}
        </Row>
      </Button>
    </Host>
  );
}
