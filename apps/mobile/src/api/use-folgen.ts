import { keepPreviousData, useQuery } from "@tanstack/react-query";

import type { Folge } from "./types";

import { archivApi } from "./archiv";

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
      return archivApi.getFolgen();
    },
    queryKey: folgenQueryKey,
    staleTime: Infinity,
  };
}
