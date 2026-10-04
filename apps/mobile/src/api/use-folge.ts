import { useQuery, useQueryClient } from "@tanstack/react-query";

import type { Folge } from "./types";

import { folgenQueryKey } from "./use-folgen";

export function useFolge(folgeId: string) {
  const queryClient = useQueryClient();

  return useQuery({
    initialData: () => {
      const folgen = queryClient.getQueryData<Folge[]>(folgenQueryKey);
      const folge = folgen?.find((f) => String(f.id) === folgeId);

      return folge;
    },
    queryFn: async () => {
      const apiUrl: unknown = process.env.EXPO_PUBLIC_DDFDB_ARCHIV_API_URL;

      if (typeof apiUrl !== "string" || !apiUrl) {
        throw new Error("Die API-Konfiguration fehlt.");
      }

      const response = await fetch(
        `${apiUrl.replace(/\/$/, "")}/folgen/${folgeId}`,
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const json = (await response.json()) as Folge;

      return json;
    },
    queryKey: ["folge", folgeId],
  });
}
