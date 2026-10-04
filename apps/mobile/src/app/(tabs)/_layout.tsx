import { NativeTabs } from "expo-router/native-tabs";
import { useColorScheme } from "react-native";

import { DdfColors } from "@/Theme";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const colors = DdfColors[colorScheme === "dark" ? "dark" : "light"];

  return (
    <NativeTabs backgroundColor={colors.page}>
      <NativeTabs.Trigger name="(archiv)">
        <NativeTabs.Trigger.Label>Archiv</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="archivebox" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="gehoert">
        <NativeTabs.Trigger.Label>Gehört</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon md="history" sf="checkmark.circle" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="gespeichert">
        <NativeTabs.Trigger.Label>Gespeichert</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon md="bookmark" sf="bookmark" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
