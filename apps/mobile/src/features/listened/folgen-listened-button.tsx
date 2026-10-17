import { Icon } from "@expo/ui";
import { useRouter } from "expo-router";

import { UIButton } from "@/components/ui/button";
import { useAuth } from "@/features/auth/use-auth";
import { HapticFeedback } from "@/lib/haptic-feedback";

import { useUpdateFolgenListenStatus } from "./use-listened";

interface FolgenListenedButtonProps {
  folgeId: number;
  folgeTitle: string;
  hasListened: boolean;
}

export function FolgenListenedButton({
  folgeId,
  folgeTitle,
  hasListened,
}: FolgenListenedButtonProps) {
  const { isAuthenticated, isPending } = useAuth();

  const router = useRouter();
  const {
    isLoading,
    markFolgeAsListenedMutation,
    markFolgeAsNotListenedMutation,
  } = useUpdateFolgenListenStatus();

  function handlePress() {
    if (!isAuthenticated) {
      router.navigate("/login");
      return;
    }

    HapticFeedback.button();
    if (hasListened) {
      markFolgeAsNotListenedMutation.mutate({ folgeId });
    } else {
      markFolgeAsListenedMutation.mutate({ folgeId });
    }
  }

  return (
    <UIButton
      accessibilityLabel={
        hasListened ? `Gehört: ${folgeTitle}` : `Nicht gehört: ${folgeTitle}`
      }
      disabled={isLoading || isPending}
      icon={
        hasListened
          ? Icon.select({
              android: import("@expo/material-symbols/check_circle.xml"),
              ios: "checkmark.circle.fill",
            })
          : Icon.select({
              android:
                import("@expo/material-symbols/radio_button_unchecked.xml"),
              ios: "checkmark.circle",
            })
      }
      iconOnly
      intent="prominent"
      label={hasListened ? "Als ungehört markieren" : "Als gehört markieren"}
      onPress={handlePress}
      tintColor={hasListened ? "green" : "transparent"}
    />
  );
}
