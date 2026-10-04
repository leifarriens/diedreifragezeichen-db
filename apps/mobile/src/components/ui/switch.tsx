import { Host, Switch, type SwitchProps } from "@expo/ui";

import { DdfColors } from "@/Theme";

export function UISwitch({ ...rest }: SwitchProps) {
  return (
    <Host matchContents seedColor={DdfColors.light.primary}>
      <Switch {...rest} />
    </Host>
  );
}
