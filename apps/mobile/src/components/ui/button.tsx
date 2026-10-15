import {
  Button,
  type ButtonProps,
  Host,
  Icon,
  type IconName,
  Row,
  Text,
} from "@expo/ui";
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

export type NativeButtonIntent = "default" | "plain" | "prominent";

export type NativeButtonStyle = Parameters<typeof buttonStyle>[0];

export interface UIButtonProps extends Omit<
  ButtonProps,
  "modifiers" | "variant"
> {
  accessibilityLabel?: string | undefined;
  icon?: IconName;
  iconColor?: ColorValue | undefined;
  iconOnly?: boolean;
  iconSize?: number;
  intent?: NativeButtonIntent;
  isLoading?: boolean;
  shape?: Parameters<typeof buttonBorderShape>[0];
  size?: Parameters<typeof controlSize>[0];
  tintColor?: Parameters<typeof tint>[0];
}

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
  plain: {
    backgroundColor: undefined,
    variant: "plain",
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
  shape,
  size = "large",
  tintColor,
  ...rest
}: UIButtonProps) {
  const modifiers: ModifierConfig[] = [
    controlSize(size),
    buttonStyle(intents[intent].variant),
    buttonBorderShape(iconOnly ? "circle" : (shape ?? "capsule")),
  ];

  if (icon && (!label || iconOnly)) {
    modifiers.push(labelStyle("iconOnly"));
  }

  if (iconOnly && label && Platform.OS === "ios") {
    modifiers.push(accessibilityLabelModifier(accessibilityLabel ?? label));
  }

  if (tintColor) {
    modifiers.push(tint(tintColor));
  }

  const seedColor = intents[intent].backgroundColor;

  return (
    <Host
      matchContents
      {...(seedColor === undefined ? {} : { seedColor })}
      style={{ height: 48, width: 48 }}
    >
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
          {!iconOnly && label !== undefined && <Text>{label}</Text>}
        </Row>
      </Button>
    </Host>
  );
}
