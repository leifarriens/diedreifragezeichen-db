import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/lib/use-auth";
import { useTRPC } from "@/trpc/client";

export function useUserRatings() {
  const trpc = useTRPC();

  const { isAuthenticated } = useAuth();

  return useQuery(
    trpc.ratings.getMine.queryOptions(undefined, {
      enabled: isAuthenticated,
    }),
  );
}
