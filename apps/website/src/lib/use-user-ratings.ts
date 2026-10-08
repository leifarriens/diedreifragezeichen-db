import { useQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";

import { useAuth } from "./use-auth";

export function useUserRatings() {
  const trpc = useTRPC();

  const { isAuthenticated } = useAuth();

  return useQuery(
    trpc.ratings.getMine.queryOptions(undefined, {
      enabled: isAuthenticated,
    }),
  );
}
