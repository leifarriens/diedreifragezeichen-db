import { STREAMING_SERVICES, type StreamingService } from "@ddfdb/core";
import { l } from "@ddfdb/core/labels";
import { Button, FieldGroup, Host, Picker, Row, Spacer, Text } from "@expo/ui";
import { scrollContentBackground } from "@expo/ui/swift-ui/modifiers";
import { Stack, useRouter, useTheme } from "expo-router";
import { Alert, Platform } from "react-native";
import { useShallow } from "zustand/react/shallow";

import { authClient } from "@/features/auth/auth-client";
import { useDeleteAccount, useSignOut } from "@/features/auth/hooks/use-auth";
import { useUserSettingsStore } from "@/features/settings/hooks/use-user-settings-store";

export function SettingsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { data: session, isPending: isSessionPending } =
    authClient.useSession();
  const signOutMutation = useSignOut();
  const { hasHydrated, streamingService } = useUserSettingsStore(
    useShallow((state) => ({
      hasHydrated: state.hasHydrated,
      streamingService: state.streamingService,
    })),
  );
  const deleteAccountMutation = useDeleteAccount();
  const setStreamingService = useUserSettingsStore(
    (state) => state.setStreamingService,
  );

  function confirmDeleteAccount() {
    Alert.alert(
      "Delete your account?",
      "This permanently deletes your account, bookmarks, listening history, and ratings. If your session has expired, sign in again and retry. This action cannot be undone.",
      [
        { style: "cancel", text: "Cancel" },
        {
          onPress: () => {
            deleteAccountMutation.mutate();
          },
          style: "destructive",
          text: "Delete account",
        },
      ],
      { cancelable: true },
    );
  }

  const isAuthenticated = !!session;
  const isAccountActionPending =
    isSessionPending ||
    signOutMutation.isPending ||
    deleteAccountMutation.isPending;

  return (
    <>
      <Stack.Screen
        options={{
          headerLargeTitleEnabled: true,
          headerShown: true,
          title: "Einstellungen",
        }}
      />

      <Host style={{ flex: 1 }}>
        <FieldGroup
          modifiers={
            Platform.OS === "ios" ? [scrollContentBackground("hidden")] : []
          }
          style={{ backgroundColor: theme.colors.background }}
        >
          {isSessionPending ? null : isAuthenticated ? (
            <FieldGroup.Section title="Konto">
              <Row alignment="center" spacing={12}>
                <Text>{session.user.name || session.user.email}</Text>
              </Row>
            </FieldGroup.Section>
          ) : (
            <FieldGroup.Section title="Konto">
              <Row alignment="center" spacing={12}>
                <Text>Melde dich an.</Text>
                <Spacer />
                <Button
                  label="Anmelden"
                  onPress={() => {
                    router.push("/login");
                  }}
                />
              </Row>
            </FieldGroup.Section>
          )}

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

            <FieldGroup.SectionFooter>
              <Text>
                Wähle deinen bevorzugten Streamingdienst aus. Dieser wird
                geöffnet wenn du in einer Folge den "Play" button drückst.
              </Text>
            </FieldGroup.SectionFooter>
          </FieldGroup.Section>

          {isAuthenticated && (
            <FieldGroup.Section title="Kontoeinstellungen">
              <Row alignment="center" spacing={12}>
                <Text>Konto abmelden</Text>
                <Spacer />
                <Button
                  disabled={isAccountActionPending}
                  label={l.MISC.LOGOUT}
                  onPress={() => {
                    signOutMutation.mutate();
                  }}
                  variant="outlined"
                />
              </Row>

              <Row alignment="center" spacing={12}>
                <Text>Konto löschen</Text>
                <Spacer />
                <Button
                  disabled={isAccountActionPending}
                  onPress={confirmDeleteAccount}
                  variant="outlined"
                >
                  <Text textStyle={{ color: "#b91c1c" }}>Löschen</Text>
                </Button>
              </Row>
            </FieldGroup.Section>
          )}
        </FieldGroup>
      </Host>
    </>
  );
}
