import { enrichFolgenWithCommunityRatings } from "@ddfdb/core";
import { keepPreviousData, useQueries, useQuery } from "@tanstack/react-query";

import { archivApi } from "./archiv";
import { useTRPC } from "./user-api";

export const folgenQueryKey = ["folgen"] as const;

export function useFolgenTotal() {
  return useQuery({
    ...getFolgenQueryOptions(),
    select: (response) => response.length,
  });
}

export function useFolgenWithCommunityRating() {
  const trpc = useTRPC();
  const queries = useQueries({
    combine([folgenQuery, communityRatingsQuery]) {
      const data =
        folgenQuery.data && communityRatingsQuery.data
          ? enrichFolgenWithCommunityRatings(
              folgenQuery.data,
              communityRatingsQuery.data,
            )
          : undefined;

      return {
        data,
        error: folgenQuery.error ?? communityRatingsQuery.error,
        isLoading: folgenQuery.isLoading || communityRatingsQuery.isLoading,
        isPaused:
          folgenQuery.fetchStatus === "paused" ||
          communityRatingsQuery.fetchStatus === "paused",
        isRefreshing:
          folgenQuery.isRefetching || communityRatingsQuery.isRefetching,
        async refetch() {
          await Promise.all([
            folgenQuery.refetch(),
            communityRatingsQuery.refetch(),
          ]);
        },
      };
    },
    queries: [
      getFolgenQueryOptions(),
      trpc.ratings.getAllCommunityRatings.queryOptions(),
    ],
  });

  return queries;
}

function getFolgenQueryOptions() {
  return {
    gcTime: Infinity,
    placeholderData: keepPreviousData, // Prevents hard loading state
    queryFn: async () => {
      return archivApi.getFolgen();
    },
    queryKey: folgenQueryKey,
    staleTime: 1000 * 60 * 60 * 24, // 24 hour
  };
}
