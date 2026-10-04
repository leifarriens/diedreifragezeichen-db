import { keepPreviousData, useQuery } from "@tanstack/react-query";

import type { Folge } from "./types";

export const folgenQueryKey = ["folgen"] as const;

export function useFolgen() {
  return useQuery({
    ...getFolgenQueryOptions(),
  });
}

export function useFolgenTotal() {
  return useQuery({
    ...getFolgenQueryOptions(),
    select: (response) => response.length,
  });
}

function getFolgenQueryOptions() {
  return {
    gcTime: Infinity,
    placeholderData: keepPreviousData, // Prevents hard loading state
    queryFn: async (): Promise<Folge[]> => {
      const apiUrl: unknown = process.env.EXPO_PUBLIC_DDFDB_ARCHIV_API_URL;

      if (typeof apiUrl !== "string" || !apiUrl) {
        throw new Error("Die API-Konfiguration fehlt.");
      }

      const url = `${apiUrl.replace(/\/$/, "")}/folgen?limit=300`;

      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(
          `Die Folgen konnten nicht geladen werden (HTTP ${String(res.status)}).`,
        );
      }

      return (await res.json()) as Folge[];
    },
    queryKey: folgenQueryKey,
    staleTime: Infinity,
  };
}
