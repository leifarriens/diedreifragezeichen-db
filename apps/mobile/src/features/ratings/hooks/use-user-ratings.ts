import { useQuery } from "@tanstack/react-query";

import { useTRPC } from "@/api/user-api";
import { useAuth } from "@/lib/use-auth";

export function useUserRatings() {
  const trpc = useTRPC();

  const { isAuthenticated } = useAuth();

  return useQuery(
    trpc.ratings.getMine.queryOptions(undefined, {
      enabled: isAuthenticated,
    }),
  );
}
