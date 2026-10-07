import { useQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";

import { useAuth } from "./use-auth";

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
