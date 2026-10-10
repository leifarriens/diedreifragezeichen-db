import type { Folge } from "@ddfdb/archiv/contracts";
import type { ComponentType } from "react";

import { STREAMING_SERVICES, type StreamingService } from "@ddfdb/core";

import {
  AmazonMusicIcon,
  AppleMusicIcon,
  DeezerIcon,
  SpotifyIcon,
  type StreamingIconProps,
  YoutubeMusicIcon,
} from "@/components/icons/streaming-icons";
import { ExternalLink } from "@/components/ui/external-link/external-link";

const STREAMING_SERVICE_ICONS: Record<
  StreamingService,
  ComponentType<StreamingIconProps>
> = {
  amazon_music: AmazonMusicIcon,
  apple_music: AppleMusicIcon,
  deezer: DeezerIcon,
  spotify: SpotifyIcon,
  youtube_music: YoutubeMusicIcon,
};

interface FolgenStreamingLinksProps {
  streaming: Folge["streaming"];
}

export function FolgenStreamingLinks({ streaming }: FolgenStreamingLinksProps) {
  return Object.entries(streaming)
    .filter(([key]) => Object.hasOwn(STREAMING_SERVICES, key))
    .map(([key, { link }]) => {
      const label = STREAMING_SERVICES[key as StreamingService];
      const Icon = STREAMING_SERVICE_ICONS[key as StreamingService];
      const ariaLabel = `Öffnet ${label} in einem neuen Tab (externer Link)`;

      return (
        <ExternalLink
          aria-label={ariaLabel}
          className="inline-flex items-center justify-center rounded-md text-neutral-200 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          href={link}
          key={key}
          title={label}
        >
          <Icon aria-hidden="true" className="size-8 shrink-0 fill-current" />
        </ExternalLink>
      );
    });
}
