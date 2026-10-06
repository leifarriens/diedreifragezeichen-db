import type { Folge } from "@ddfdb/archiv/contracts";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { useTRPC } from "@/trpc/client";

import type { FolgeWithUserRating } from "./types";

import { authClient } from "./auth-client";

export function useFolgenWithUserRating(
  folgen: Folge[],
): FolgeWithUserRating[] {
  const trpc = useTRPC();
  const { data: session } = authClient.useSession();
  const { data: userRatings } = useQuery(
    trpc.ratings.getMine.queryOptions(undefined, {
      enabled: !!session,
    }),
  );

  return useMemo(() => {
    if (userRatings) {
      return folgen.map((folge) => {
        const userRating = userRatings.find(
          (rating) => rating.folgeId === folge.id,
        );

        return userRating ? { ...folge, userRating: userRating.score } : folge;
      });
    }

    return folgen;
  }, [folgen, userRatings]);
}
