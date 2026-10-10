import type { AppRouter } from "@ddfdb/user-api";
import type { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import type { TRPCClientErrorLike } from "@trpc/client";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { UseTRPC } from "../../types";

interface ListenedHooks {
  useUpdateFolgenListenStatus: () => {
    addListenedMutation: UseMutationResult<
      inferRouterOutputs<AppRouter>["listened"]["addListened"],
      TRPCClientErrorLike<AppRouter>,
      inferRouterInputs<AppRouter>["listened"]["addListened"]
    >;
    isLoading: boolean;
    removeListenedMutation: UseMutationResult<
      inferRouterOutputs<AppRouter>["listened"]["removeListened"],
      TRPCClientErrorLike<AppRouter>,
      inferRouterInputs<AppRouter>["listened"]["removeListened"]
    >;
  };
  useUserListened: () => UseQueryResult<
    inferRouterOutputs<AppRouter>["listened"]["getUserListened"],
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
      trpc.listened.getUserListened.queryOptions(undefined, {
        enabled: isAuthenticated,
        staleTime: Infinity,
      }),
    );
  }

  function useUpdateFolgenListenStatus() {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    const addListenedMutation = useMutation(
      trpc.listened.addListened.mutationOptions({
        async onError() {
          await invalidate();
        },
        onMutate({ folgeId }) {
          queryClient.setQueryData(
            trpc.listened.getUserListened.queryKey(),
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

    const removeListenedMutation = useMutation(
      trpc.listened.removeListened.mutationOptions({
        async onError() {
          await invalidate();
        },
        onMutate({ folgeId }) {
          queryClient.setQueryData(
            trpc.listened.getUserListened.queryKey(),
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
        queryKey: trpc.listened.getUserListened.queryKey(),
      });
    }

    return {
      addListenedMutation,
      isLoading: addListenedMutation.isPending || removeListenedMutation.isPending,
      removeListenedMutation,
    };
  }

  return { useUpdateFolgenListenStatus, useUserListened };
}
