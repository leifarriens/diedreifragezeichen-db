import type { FolgeListItem } from "@ddfdb/client";

import { useQuery } from "@tanstack/react-query";

export function useFolgen() {
  const query = useQuery({
    queryFn: async () => {
      const response = await fetch("/api/v0/folgen");

      if (!response.ok) {
        throw new Error("Failed to fetch folgen");
      }
      const data = (await response.json()) as unknown;

      return data as FolgeListItem[];
    },
    queryKey: ["folgen"],
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });

  return query;
}
