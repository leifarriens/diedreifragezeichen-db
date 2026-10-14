"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import type { SearchNavigationHandler } from "../hooks/use-search-state";

export function SearchUrlNavigationObserver({
  onNavigate,
}: {
  onNavigate: SearchNavigationHandler;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();

  useEffect(() => {
    onNavigate(pathname, window.location.search);
  }, [onNavigate, pathname, search]);

  return null;
}
