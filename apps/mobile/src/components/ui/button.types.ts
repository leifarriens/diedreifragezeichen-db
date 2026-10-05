import type { ButtonProps, IconName } from "@expo/ui";
import type {
  buttonStyle,
  controlSize,
  tint,
} from "@expo/ui/swift-ui/modifiers";
import type { ColorValue } from "react-native";

export type NativeButtonIntent = "default" | "prominent";

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
  size?: Parameters<typeof controlSize>[0];
  tintColor?: Parameters<typeof tint>[0];
}
