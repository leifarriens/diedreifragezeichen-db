import type { AppRouter } from "@ddfdb/user-api";
import type { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import type { TRPCClientErrorLike } from "@trpc/client";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { UseTRPC } from "../../types";

interface RatingHooks {
  useUpdateRating: () => {
    isLoading: boolean;
    ratingMutation: UseMutationResult<
      inferRouterOutputs<AppRouter>["ratings"]["upsertMyRating"],
      TRPCClientErrorLike<AppRouter>,
      inferRouterInputs<AppRouter>["ratings"]["upsertMyRating"]
    >;
    removeRatingMutation: UseMutationResult<
      inferRouterOutputs<AppRouter>["ratings"]["deleteMyRating"],
      TRPCClientErrorLike<AppRouter>,
      inferRouterInputs<AppRouter>["ratings"]["deleteMyRating"]
    >;
  };
  useUserFolgenRating: (folgeId: number) => {
    isLoading: boolean;
    rating: undefined | { folgeId: number; score: number; updatedAt: string };
  };
  useUserRatings: () => UseQueryResult<
    inferRouterOutputs<AppRouter>["ratings"]["getMyRatings"],
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
      trpc.ratings.getMyRatings.queryOptions(undefined, {
        enabled: isAuthenticated,
      }),
    );
  }

  function useUpdateRating() {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    const ratingMutation = useMutation(
      trpc.ratings.upsertMyRating.mutationOptions({
        async onError(error) {
          console.error("Failed to update rating:", error);
          await invalidate();
        },
        onMutate({ folgeId, score }) {
          queryClient.setQueryData(
            trpc.ratings.getMyRatings.queryKey(),
            (prev) => {
              const rating = {
                folgeId,
                score,
                updatedAt: new Date().toISOString(),
              };

              return prev
                ? [...prev.filter((r) => r.folgeId !== folgeId), rating]
                : [rating];
            },
          );
        },
      }),
    );

    const removeRatingMutation = useMutation(
      trpc.ratings.deleteMyRating.mutationOptions({
        async onError() {
          await invalidate();
        },
        onMutate({ folgeId }) {
          queryClient.setQueryData(
            trpc.ratings.getMyRatings.queryKey(),
            (prev) => {
              return prev ? prev.filter((r) => r.folgeId !== folgeId) : [];
            },
          );
        },
      }),
    );

    function invalidate() {
      return queryClient.invalidateQueries({
        queryKey: trpc.ratings.getMyRatings.queryKey(),
      });
    }

    return {
      isLoading: ratingMutation.isPending || removeRatingMutation.isPending,
      ratingMutation,
      removeRatingMutation,
    };
  }

  function useUserFolgenRating(folgeId: number) {
    const { data: userRatings, isLoading } = useUserRatings();

    return {
      isLoading,
      rating: userRatings?.find((rating) => rating.folgeId === folgeId),
    };
  }

  return { useUpdateRating, useUserFolgenRating, useUserRatings };
}
