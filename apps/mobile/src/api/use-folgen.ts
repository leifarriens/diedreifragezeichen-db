import { keepPreviousData, useQuery } from "@tanstack/react-query";

import type { Folge } from "./types";

export const folgenQueryKey = ["folgen"] as const;

export interface FolgenResponse {
  items: Folge[];
  total: number;
}

export function useFolgen() {
  return useQuery({
    ...getFolgenQueryOptions(),
    select: (response) => response.items,
  });
}

export function useFolgenTotal() {
  return useQuery({
    ...getFolgenQueryOptions(),
    select: (response) => response.total,
  });
}

function getFolgenQueryOptions() {
  return {
    gcTime: Infinity,
    placeholderData: keepPreviousData, // Prevents hard loading state
    queryFn: async (): Promise<FolgenResponse> => {
      const apiUrl: unknown = process.env.EXPO_PUBLIC_DDFDB_API_URL;
      const apiKey: unknown = process.env.EXPO_PUBLIC_DDFDB_API_KEY;

      if (
        typeof apiUrl !== "string" ||
        !apiUrl ||
        typeof apiKey !== "string" ||
        !apiKey
      ) {
        throw new Error("Die API-Konfiguration fehlt.");
      }

      const url = `${apiUrl.replace(/\/$/, "")}/folgen?limit=300&apikey=${encodeURIComponent(apiKey)}`;

      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(
          `Die Folgen konnten nicht geladen werden (HTTP ${String(res.status)}).`,
        );
      }

      return (await res.json()) as FolgenResponse;
    },
    queryKey: folgenQueryKey,
    staleTime: Infinity,
  };
}
