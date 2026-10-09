import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";

export function useUpdateFolgenListenStatus(
  folgeId: number,
  hasListened: boolean,
) {
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
            return prev ? prev.filter((item) => item.folgeId !== folgeId) : [];
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
