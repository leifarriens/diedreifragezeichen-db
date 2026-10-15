import { STREAMING_SERVICES, type StreamingService } from "@ddfdb/core";
import { l } from "@ddfdb/core/labels";
import { Button, FieldGroup, Host, Picker, Row, Spacer, Text } from "@expo/ui";
import { scrollContentBackground } from "@expo/ui/swift-ui/modifiers";
import { useQueryClient } from "@tanstack/react-query";
import { Stack, useRouter, useTheme } from "expo-router";
import { useState } from "react";
import { Alert, Platform } from "react-native";
import { useShallow } from "zustand/react/shallow";

import { authClient } from "@/features/auth/auth-client";
import { useUserSettingsStore } from "@/features/settings/hooks/use-user-settings-store";

export function SettingsScreen() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { colors } = useTheme();
  const { data: session, isPending: isSessionPending } =
    authClient.useSession();
  const [accountError, setAccountError] = useState<null | string>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
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

  async function handleDeleteAccount() {
    setAccountError(null);
    setIsDeletingAccount(true);

    try {
      const result = await authClient.deleteUser();

      if (result.error) {
        setAccountError(
          `${result.error.message ?? "Could not delete your account."} If your session has expired, sign out and sign back in before trying again.`,
        );
        return;
      }

      queryClient.clear();
      router.replace("/(tabs)/settings/sign-in");
    } catch (reason) {
      setAccountError(
        reason instanceof Error
          ? reason.message
          : "Could not delete your account. If your session has expired, sign out and sign back in before trying again.",
      );
    } finally {
      setIsDeletingAccount(false);
    }
  }

  function confirmDeleteAccount() {
    Alert.alert(
      "Delete your account?",
      "This permanently deletes your account, bookmarks, listening history, and ratings. If your session has expired, sign in again and retry. This action cannot be undone.",
      [
        { style: "cancel", text: "Cancel" },
        {
          onPress: () => {
            void handleDeleteAccount();
          },
          style: "destructive",
          text: "Delete account",
        },
      ],
      { cancelable: true },
    );
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
          <FieldGroup.Section title={l.MISC.ACCOUNT}>
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
                    disabled={isSigningOut || isDeletingAccount}
                    label={isSigningOut ? "Signing out..." : l.MISC.LOGOUT}
                    onPress={() => {
                      void handleSignOut();
                    }}
                  />
                </Row>
                <Row alignment="center" spacing={12}>
                  <Spacer />
                  <Button
                    disabled={isSigningOut || isDeletingAccount}
                    onPress={confirmDeleteAccount}
                    variant="text"
                  >
                    <Text textStyle={{ color: "#b91c1c" }}>
                      {isDeletingAccount
                        ? "Deleting account..."
                        : "Delete account"}
                    </Text>
                  </Button>
                </Row>
              </>
            ) : (
              <Row alignment="center" spacing={12}>
                <Text>Sign in to access your account.</Text>
                <Spacer />
                <Button
                  label="Sign in"
                  onPress={() => {
                    router.push("/auth/login");
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
