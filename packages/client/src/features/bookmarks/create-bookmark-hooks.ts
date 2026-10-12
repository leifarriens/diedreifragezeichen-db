import type { AppRouter } from "@ddfdb/user-api";
import type { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import type { TRPCClientErrorLike } from "@trpc/client";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { UseTRPC } from "../../types";

interface BookmarkHooks {
  useUpdateFolgenBookmark: () => {
    addBookmarkMutation: UseMutationResult<
      inferRouterOutputs<AppRouter>["bookmarks"]["addBookmark"],
      TRPCClientErrorLike<AppRouter>,
      inferRouterInputs<AppRouter>["bookmarks"]["addBookmark"]
    >;
    isLoading: boolean;
    removeBookmarkMutation: UseMutationResult<
      inferRouterOutputs<AppRouter>["bookmarks"]["removeBookmark"],
      TRPCClientErrorLike<AppRouter>,
      inferRouterInputs<AppRouter>["bookmarks"]["removeBookmark"]
    >;
  };
  useUserBookmarks: () => UseQueryResult<
    inferRouterOutputs<AppRouter>["bookmarks"]["getMyBookmarks"],
    TRPCClientErrorLike<AppRouter>
  >;
}

export function createBookmarkHooks({
  useAuth,
  useTRPC,
}: {
  useAuth: () => { isAuthenticated: boolean };
  useTRPC: UseTRPC;
}): BookmarkHooks {
  function useUserBookmarks() {
    const trpc = useTRPC();
    const { isAuthenticated } = useAuth();

    return useQuery(
      trpc.bookmarks.getMyBookmarks.queryOptions(undefined, {
        enabled: isAuthenticated,
        staleTime: Infinity,
      }),
    );
  }

  function useUpdateFolgenBookmark() {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    const addBookmarkMutation = useMutation(
      trpc.bookmarks.addBookmark.mutationOptions({
        async onError() {
          await invalidate();
        },
        onMutate({ folgeId }) {
          queryClient.setQueryData(
            trpc.bookmarks.getMyBookmarks.queryKey(),
            (prev) => {
              const bookmark = {
                createdAt: new Date().toISOString(),
                folgeId,
              };

              return prev ? [...prev, bookmark] : [bookmark];
            },
          );
        },
      }),
    );

    const removeBookmarkMutation = useMutation(
      trpc.bookmarks.removeBookmark.mutationOptions({
        async onError() {
          await invalidate();
        },
        onMutate({ folgeId }) {
          queryClient.setQueryData(
            trpc.bookmarks.getMyBookmarks.queryKey(),
            (prev) => {
              return prev
                ? prev.filter((bookmark) => bookmark.folgeId !== folgeId)
                : [];
            },
          );
        },
      }),
    );

    function invalidate() {
      return queryClient.invalidateQueries({
        queryKey: trpc.bookmarks.getMyBookmarks.queryKey(),
      });
    }

    return {
      addBookmarkMutation,
      isLoading:
        addBookmarkMutation.isPending || removeBookmarkMutation.isPending,
      removeBookmarkMutation,
    };
  }

  return {
    useUpdateFolgenBookmark,
    useUserBookmarks,
  };
}
