import { Link } from "expo-router";
import { View } from "react-native";

import type { Folge } from "@/api/types";

import { UIButton } from "@/components/ui/button";
import {
  STREAMING_SERVICES,
  useUserSettingsStore,
} from "@/features/settings/hooks/use-user-settings-store";

import { isExternalHref } from "../is-external-href";

interface FolgenPlayButtonProps {
  links: Folge["links"];
}

export function FolgenPlayButton({ links }: FolgenPlayButtonProps) {
  const streamingService = useUserSettingsStore(
    (state) => state.streamingService,
  );
  const hasHydrated = useUserSettingsStore((state) => state.hasHydrated);
  const streamingLink = streamingService ? links[streamingService] : undefined;

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
