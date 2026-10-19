import type { Folge } from "@ddfdb/archiv/contracts";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import { archivApi } from "./archiv";
import { folgenQueryKey } from "./use-folgen-with-community-rating";

export function useFolge(folgeId: string) {
  const queryClient = useQueryClient();

  return useQuery({
    initialData: () => {
      const folgen = queryClient.getQueryData<Folge[]>(folgenQueryKey);
      const folge = folgen?.find((f) => String(f.id) === folgeId);

      return folge;
    },
    queryFn: async () => {
      return archivApi.getFolgeById(folgeId);
    },
    queryKey: ["folge", folgeId],
  });
}
