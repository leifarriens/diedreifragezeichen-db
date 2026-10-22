import { selectCollectionFolgen } from "@ddfdb/core";
import { useMemo } from "react";

import { useFolgen } from "@/features/folgen/hooks/use-folgen";

import { useUserListened } from "./use-listened";

export function useUserListenedFolgen() {
  const folgenQuery = useFolgen();
  const userListenedQuery = useUserListened();

  return {
    data: useMemo(
      () =>
        selectCollectionFolgen(
          folgenQuery.data ?? [],
          userListenedQuery.data ?? [],
        ),
      [folgenQuery.data, userListenedQuery.data],
    ),
    isLoading: folgenQuery.isLoading || userListenedQuery.isLoading,
    isRefreshing: userListenedQuery.isRefetching,
  };
}
