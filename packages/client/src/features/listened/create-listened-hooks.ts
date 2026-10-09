import type { AppRouter } from "@ddfdb/user-api";
import type { UseQueryResult } from "@tanstack/react-query";
import type { TRPCClientErrorLike } from "@trpc/client";
import type { inferRouterOutputs } from "@trpc/server";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { UseTRPC } from "../../types";

interface ListenedHooks {
  useUpdateFolgenListenStatus: (
    folgeId: number,
    hasListened: boolean,
  ) => {
    isLoading: boolean;
    toggleListenStatus: () => void;
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

  function useUpdateFolgenListenStatus(folgeId: number, hasListened: boolean) {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    const listenedMutation = useMutation(
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

    function toggleListenStatus() {
      if (hasListened) {
        removeListenedMutation.mutate({ folgeId });
      } else {
        listenedMutation.mutate({ folgeId });
      }
    }

    return {
      isLoading: listenedMutation.isPending || removeListenedMutation.isPending,
      toggleListenStatus,
    };
  }

  return { useUpdateFolgenListenStatus, useUserListened };
}
