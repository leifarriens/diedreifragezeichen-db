"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";

import { getIsMacOS } from "../utils";

const ArchiveSearch = dynamic(() =>
  import("./archive-search").then((module) => module.ArchiveSearch),
);

const SpotlightSearch = dynamic(() =>
  import("./spotlight-search").then((module) => module.SpotlightSearch),
);

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
