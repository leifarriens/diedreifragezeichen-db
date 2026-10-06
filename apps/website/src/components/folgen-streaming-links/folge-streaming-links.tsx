import type { Folge } from "@ddfdb/archiv/contracts";
import type { ComponentType } from "react";

import { ExternalLink } from "../external-link/external-link";
import {
  AppleMusicIcon,
  DeezerIcon,
  SpotifyIcon,
  type StreamingIconProps,
  YoutubeMusicIcon,
} from "../icons/streaming-icons";

export const STREAMING_SERVICES = {
  amazon_music: { label: "Amazon Music" },
  apple_music: { Icon: AppleMusicIcon, label: "Apple Music" },
  bookbeat: { label: "BookBeat" },
  deezer: { Icon: DeezerIcon, label: "Deezer" },
  spotify: { Icon: SpotifyIcon, label: "Spotify" },
  youtube_music: { Icon: YoutubeMusicIcon, label: "YouTube Music" },
} satisfies Record<
  string,
  { Icon?: ComponentType<StreamingIconProps>; label: string }
>;

export type StreamingService = keyof typeof STREAMING_SERVICES;

interface FolgenStreamingLinksProps {
  links: Folge["links"];
}

export function FolgenStreamingLinks({ links }: FolgenStreamingLinksProps) {
  return Object.entries(links)
    .filter(([key]) => Object.hasOwn(STREAMING_SERVICES, key))
    .map(([key, href]) => {
      const service = STREAMING_SERVICES[key as StreamingService];
      const ariaLabel = `Öffnet ${service.label} in einem neuen Tab (externer Link)`;
      const Icon = "Icon" in service ? service.Icon : undefined;

      return (
        <ExternalLink
          aria-label={ariaLabel}
          className="inline-flex items-center justify-center rounded-md text-neutral-200 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          href={href}
          key={key}
        >
          {Icon ? (
            <Icon aria-hidden="true" className="size-8 shrink-0 fill-current" />
          ) : (
            service.label
          )}
        </ExternalLink>
      );
    });
}
