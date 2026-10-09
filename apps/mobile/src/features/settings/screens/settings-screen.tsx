import { STREAMING_SERVICES, type StreamingService } from "@ddfdb/core";
import { Button, FieldGroup, Host, Picker, Row, Spacer, Text } from "@expo/ui";
import { scrollContentBackground } from "@expo/ui/swift-ui/modifiers";
import { Stack, useRouter, useTheme } from "expo-router";
import { useState } from "react";
import { Platform } from "react-native";
import { useShallow } from "zustand/react/shallow";

import { useUserSettingsStore } from "@/features/settings/hooks/use-user-settings-store";
import { authClient } from "@/lib/auth-client";

export function SettingsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { data: session, isPending: isSessionPending } =
    authClient.useSession();
  const [accountError, setAccountError] = useState<null | string>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const { hasHydrated, streamingService } = useUserSettingsStore(
    useShallow((state) => ({
      hasHydrated: state.hasHydrated,
      streamingService: state.streamingService,
    })),
  );
  const setStreamingService = useUserSettingsStore(
    (state) => state.setStreamingService,
  );

  async function handleSignOut() {
    setAccountError(null);
    setIsSigningOut(true);

    try {
      const result = await authClient.signOut();
      if (result.error) {
        setAccountError(result.error.message ?? "Could not sign out.");
      }
    } catch (reason) {
      setAccountError(
        reason instanceof Error ? reason.message : "Could not sign out.",
      );
    } finally {
      setIsSigningOut(false);
    }
  }

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
          <FieldGroup.Section title="Account">
            {isSessionPending ? (
              <Row alignment="center" spacing={12}>
                <Text>Checking account...</Text>
              </Row>
            ) : session ? (
              <>
                <Row alignment="center" spacing={12}>
                  <Text>{session.user.name || session.user.email}</Text>
                </Row>
                <Row alignment="center" spacing={12}>
                  <Text>{session.user.email}</Text>
                </Row>
                <Row alignment="center" spacing={12}>
                  <Text>{session.user.id}</Text>
                </Row>
                <Row alignment="center" spacing={12}>
                  <Spacer />
                  <Button
                    disabled={isSigningOut}
                    label={isSigningOut ? "Signing out..." : "Sign out"}
                    onPress={() => {
                      void handleSignOut();
                    }}
                  />
                </Row>
              </>
            ) : (
              <Row alignment="center" spacing={12}>
                <Text>Sign in to access your account.</Text>
                <Spacer />
                <Button
                  label="Sign in"
                  onPress={() => {
                    router.push("/(tabs)/settings/sign-in");
                  }}
                />
              </Row>
            )}
            {accountError ? (
              <Row alignment="center" spacing={12}>
                <Text>{accountError}</Text>
              </Row>
            ) : null}
          </FieldGroup.Section>

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
                {Object.entries(STREAMING_SERVICES).map(([value, label]) => (
                  <Picker.Item key={value} label={label} value={value} />
                ))}
              </Picker>
            </Row>
          </FieldGroup.Section>
        </FieldGroup>
      </Host>
    </>
  );
}
