import { NativeTabs } from "expo-router/native-tabs";
import { useColorScheme } from "react-native";

import { DdfColors } from "@/Theme";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const colors = DdfColors[colorScheme === "dark" ? "dark" : "light"];

  return (
    <NativeTabs backgroundColor={colors.page}>
      <NativeTabs.Trigger name="archiv">
        <NativeTabs.Trigger.Label>Archiv</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="archivebox" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="sammlung">
        <NativeTabs.Trigger.Label>Sammlung</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="books.vertical" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
