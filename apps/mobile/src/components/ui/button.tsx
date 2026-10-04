import type { ButtonProps, IconName } from "@expo/ui";
import type { ColorValue } from "react-native";

import { Button, Host, Icon, Row, Text } from "@expo/ui";
import {
  buttonBorderShape,
  buttonStyle,
  controlSize,
  labelStyle,
  type ModifierConfig,
  tint,
} from "@expo/ui/swift-ui/modifiers";

export interface UIButtonProps extends Omit<
  ButtonProps,
  "modifiers" | "variant"
> {
  icon?: IconName;
  iconColor?: ColorValue | undefined;
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

  if (icon && !label) {
    modifiers.push(labelStyle("iconOnly"), buttonBorderShape("circle"));
  }

  if (tintColor) {
    modifiers.push(tint(tintColor));
  }

  return (
    <Host matchContents seedColor={intents[intent].backgroundColor}>
      <Button modifiers={modifiers} {...rest}>
        <Row alignment="center" spacing={6}>
          {icon ? <Icon color={iconColor} name={icon} size={iconSize} /> : null}
          <Text>{label}</Text>
        </Row>
      </Button>
    </Host>
  );
}
