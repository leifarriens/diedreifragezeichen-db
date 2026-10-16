"use client";

import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";

import { getIsMacOS } from "../utils";
import { ArchiveSearch } from "./archive-search";
import { SpotlightSearch } from "./spotlight-search";

interface SearchInputProps {
  className?: string | undefined;
}

export function GlobalSearchInput({ className }: SearchInputProps) {
  const pathname = usePathname();
  const isArchivePage = pathname === "/";

  const isMacOS = useSyncExternalStore(
    subscribeToPlatformChanges,
    getIsMacOS,
    () => false,
  );

  if (isArchivePage) {
    return (
      <ArchiveSearch
        className={className}
        platform={isMacOS ? "macos" : "other"}
      />
    );
  }

  return (
    <SpotlightSearch
      className={className}
      platform={isMacOS ? "macos" : "other"}
    />
  );
}

function subscribeToPlatformChanges(onChange: () => void) {
  window.addEventListener("pageshow", onChange);
  return () => {
    window.removeEventListener("pageshow", onChange);
  };
}
