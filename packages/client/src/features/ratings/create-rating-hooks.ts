import type { AppRouter } from "@ddfdb/user-api";
import type { UseQueryResult } from "@tanstack/react-query";
import type { TRPCClientErrorLike } from "@trpc/client";
import type { inferRouterOutputs } from "@trpc/server";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { UseTRPC } from "../../types";

interface RatingHooks {
  useUpdateRating: (folgeId: number) => {
    isLoading: boolean;
    setRating: (score: number) => void;
  };
  useUserRatings: () => UseQueryResult<
    inferRouterOutputs<AppRouter>["ratings"]["getMine"],
    TRPCClientErrorLike<AppRouter>
  >;
}

export function createRatingHooks({
  useAuth,
  useTRPC,
}: {
  useAuth: () => { isAuthenticated: boolean };
  useTRPC: UseTRPC;
}): RatingHooks {
  function useUserRatings() {
    const trpc = useTRPC();

    const { isAuthenticated } = useAuth();

    return useQuery(
      trpc.ratings.getMine.queryOptions(undefined, {
        enabled: isAuthenticated,
      }),
    );
  }

  function useUpdateRating(folgeId: number) {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    const ratingMutation = useMutation(
      trpc.ratings.set.mutationOptions({
        async onError() {
          await invalidate();
        },
        onMutate({ folgeId, score }) {
          queryClient.setQueryData(trpc.ratings.getMine.queryKey(), (prev) => {
            const rating = {
              folgeId,
              score,
              updatedAt: new Date().toISOString(),
            };

            return prev
              ? [...prev.filter((r) => r.folgeId !== folgeId), rating]
              : [rating];
          });
        },
      }),
    );

    const removeRatingMutation = useMutation(
      trpc.ratings.remove.mutationOptions({
        async onError() {
          await invalidate();
        },
        onMutate({ folgeId }) {
          queryClient.setQueryData(trpc.ratings.getMine.queryKey(), (prev) => {
            return prev ? prev.filter((r) => r.folgeId !== folgeId) : [];
          });
        },
      }),
    );

    function setRating(score: number) {
      ratingMutation.mutate({ folgeId, score });
    }

    function removeRating(folgeId: number) {
      removeRatingMutation.mutate({ folgeId });
    }

    function invalidate() {
      return queryClient.invalidateQueries({
        queryKey: trpc.ratings.getMine.queryKey(),
      });
    }

    return { isLoading: ratingMutation.isPending, removeRating, setRating };
  }

  return { useUpdateRating, useUserRatings };
}
