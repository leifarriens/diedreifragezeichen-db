import { useQuery, useQueryClient } from "@tanstack/react-query";

import { Folge } from "./types";
import { folgenQueryKey } from "./use-folgen";

export function useFolge(folgeId: string) {
  const queryClient = useQueryClient();

  return useQuery({
    initialData: () => {
      const folgen = queryClient.getQueryData<Folge[]>(folgenQueryKey);
      const folge = folgen?.find((f) => f._id === folgeId);

      return folge;
    },
    queryFn: async () => {
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

      const response = await fetch(
        `${apiUrl.replace(/\/$/, "")}/folgen/${folgeId}?apikey=${encodeURIComponent(apiKey)}`,
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
