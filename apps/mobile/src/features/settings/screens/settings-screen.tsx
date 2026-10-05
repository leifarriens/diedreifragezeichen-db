import { FieldGroup, Host, Picker, Row, Spacer, Text } from "@expo/ui";
import { scrollContentBackground } from "@expo/ui/swift-ui/modifiers";
import { Stack, useTheme } from "expo-router";
import { Platform } from "react-native";
import { useShallow } from "zustand/react/shallow";

import {
  STREAMING_SERVICES,
  type StreamingService,
  useUserSettingsStore,
} from "@/features/settings/hooks/use-user-settings-store";

export function SettingsScreen() {
  const { colors } = useTheme();
  const { hasHydrated, streamingService } = useUserSettingsStore(
    useShallow((state) => ({
      hasHydrated: state.hasHydrated,
      streamingService: state.streamingService,
    })),
  );
  const setStreamingService = useUserSettingsStore(
    (state) => state.setStreamingService,
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: "Einstellungen",
        }}
      />

      <Host style={{ backgroundColor: colors.background, flex: 1 }}>
        <FieldGroup
          modifiers={
            Platform.OS === "ios" ? [scrollContentBackground("hidden")] : []
          }
          style={{ backgroundColor: colors.background }}
        >
          <FieldGroup.Section title="Play">
            <Row alignment="center" spacing={12}>
              <Text>Streamingdienst</Text>
              <Spacer />
              <Picker<"" | StreamingService>
                enabled={hasHydrated}
                onValueChange={(service) => {
                  setStreamingService(service === "" ? null : service);
                }}
                selectedValue={streamingService ?? ""}
                testID="streaming-service-picker"
              >
                {/* <Picker.Item label="Bitte auswählen" value="" /> */}
                {STREAMING_SERVICES.map((service) => (
                  <Picker.Item
                    key={service.value}
                    label={service.label}
                    value={service.value}
                  />
                ))}
              </Picker>
            </Row>
          </FieldGroup.Section>
        </FieldGroup>
      </Host>
    </>
  );
}
