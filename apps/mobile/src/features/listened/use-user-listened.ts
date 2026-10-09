import { useQuery } from "@tanstack/react-query";

import { useTRPC } from "@/api/user-api";
import { useAuth } from "@/lib/use-auth";

export function useUserListened() {
  const trpc = useTRPC();
  const { isAuthenticated } = useAuth();

  return useQuery(
    trpc.listened.getUserListened.queryOptions(undefined, {
      enabled: isAuthenticated,
      staleTime: Infinity,
    }),
  );
}
