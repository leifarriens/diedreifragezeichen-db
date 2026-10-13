import type { AppRouter } from "@ddfdb/user-api";
import type { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import type { TRPCClientErrorLike } from "@trpc/client";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { UseTRPC } from "../../types";

export interface ListenedHooks {
  useUpdateFolgenListenStatus: () => {
    isLoading: boolean;
    markFolgeAsListenedMutation: UseMutationResult<
      inferRouterOutputs<AppRouter>["listened"]["markFolgeAsListened"],
      TRPCClientErrorLike<AppRouter>,
      inferRouterInputs<AppRouter>["listened"]["markFolgeAsListened"]
    >;
    markFolgeAsNotListenedMutation: UseMutationResult<
      inferRouterOutputs<AppRouter>["listened"]["markFolgeAsNotListened"],
      TRPCClientErrorLike<AppRouter>,
      inferRouterInputs<AppRouter>["listened"]["markFolgeAsNotListened"]
    >;
  };
  useUserListened: () => UseQueryResult<
    inferRouterOutputs<AppRouter>["listened"]["getMyListenedFolgen"],
    TRPCClientErrorLike<AppRouter>
  >;
}

export function createListenedHooks({
  useAuth,
  useTRPC,
}: {
  useAuth: () => { isAuthenticated: boolean };
  useTRPC: UseTRPC;
}): ListenedHooks {
  function useUserListened() {
    const trpc = useTRPC();
    const { isAuthenticated } = useAuth();

    return useQuery(
      trpc.listened.getMyListenedFolgen.queryOptions(undefined, {
        enabled: isAuthenticated,
        staleTime: Infinity,
      }),
    );
  }

  function useUpdateFolgenListenStatus() {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    const markFolgeAsListenedMutation = useMutation(
      trpc.listened.markFolgeAsListened.mutationOptions({
        async onError() {
          await invalidate();
        },
        onMutate({ folgeId }) {
          queryClient.setQueryData(
            trpc.listened.getMyListenedFolgen.queryKey(),
            (prev) => {
              const listened = {
                createdAt: new Date().toISOString(),
                folgeId,
              };

              return prev ? [...prev, listened] : [listened];
            },
          );
        },
      }),
    );

    const markFolgeAsNotListenedMutation = useMutation(
      trpc.listened.markFolgeAsNotListened.mutationOptions({
        async onError() {
          await invalidate();
        },
        onMutate({ folgeId }) {
          queryClient.setQueryData(
            trpc.listened.getMyListenedFolgen.queryKey(),
            (prev) => {
              return prev
                ? prev.filter((item) => item.folgeId !== folgeId)
                : [];
            },
          );
        },
      }),
    );

    function invalidate() {
      return queryClient.invalidateQueries({
        queryKey: trpc.listened.getMyListenedFolgen.queryKey(),
      });
    }

    return {
      isLoading:
        markFolgeAsListenedMutation.isPending ||
        markFolgeAsNotListenedMutation.isPending,
      markFolgeAsListenedMutation,
      markFolgeAsNotListenedMutation,
    };
  }

  return { useUpdateFolgenListenStatus, useUserListened };
}
