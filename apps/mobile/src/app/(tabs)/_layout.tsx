import { l } from "@ddfdb/core/labels";
import { useTheme } from "expo-router";
import { NativeTabs } from "expo-router/native-tabs";

export default function TabLayout() {
  const theme = useTheme();

  return (
    <NativeTabs backgroundColor={theme.colors.background}>
      <NativeTabs.Trigger name="(archiv)">
        <NativeTabs.Trigger.Label>Archiv</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="archivebox" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="gespeichert">
        <NativeTabs.Trigger.Label>{l.BOOKMARKS.NAME}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon md="bookmark" sf="bookmark" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="gehoert">
        <NativeTabs.Trigger.Label>{l.LISTENED.NAME}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon md="history" sf="checkmark.circle" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="bewertet">
        <NativeTabs.Trigger.Label>{l.RATINGS.NAME}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          md="rate_review"
          sf="wallet.sensor.tag.radiowaves.left.and.right"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Label>Einstellungen</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon md="settings" sf="gear" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
