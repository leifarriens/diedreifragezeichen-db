import type { Folge } from "@ddfdb/archiv/contracts";

import { STREAMING_SERVICES } from "@ddfdb/core";
import { Link } from "expo-router";
import { View } from "react-native";

import { UIButton } from "@/components/ui/button";
import { useUserSettingsStore } from "@/features/settings/hooks/use-user-settings-store";

import { isExternalHref } from "../is-external-href";

interface FolgenPlayButtonProps {
  streaming: Folge["streaming"];
}

export function FolgenPlayButton({ streaming }: FolgenPlayButtonProps) {
  const streamingService = useUserSettingsStore(
    (state) => state.streamingService,
  );
  const hasHydrated = useUserSettingsStore((state) => state.hasHydrated);
  const streamingLink = streamingService
    ? streaming[streamingService]?.link
    : undefined;

  if (
    !hasHydrated ||
    !streamingLink ||
    !streamingService ||
    !isExternalHref(streamingLink)
  ) {
    return <View />;
  }

  return (
    <Link asChild href={streamingLink} target="_blank">
      <UIButton
        accessibilityLabel={`Auf ${STREAMING_SERVICES[streamingService]} Abspielen`}
        icon="play"
        intent="prominent"
        label="Play"
        tintColor="gray"
      />
    </Link>
  );
}
