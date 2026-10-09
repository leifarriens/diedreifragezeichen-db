import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/lib/use-auth";
import { useTRPC } from "@/trpc/client";

export function useUserBookmarks() {
  const trpc = useTRPC();
  const { isAuthenticated } = useAuth();

  return useQuery(
    trpc.bookmarks.getUserBookmarks.queryOptions(undefined, {
      enabled: isAuthenticated,
      staleTime: Infinity,
    }),
  );
}
