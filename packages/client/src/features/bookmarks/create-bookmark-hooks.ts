import type { AppRouter } from "@ddfdb/user-api";
import type { UseQueryResult } from "@tanstack/react-query";
import type { TRPCClientErrorLike } from "@trpc/client";
import type { inferRouterOutputs } from "@trpc/server";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { UseTRPC } from "../../types";

interface BookmarkHooks {
  useUpdateFolgenBookmark: (
    folgeId: number,
    isBookmarked: boolean,
  ) => {
    isLoading: boolean;
    toggleBookmark: () => void;
  };
  useUserBookmarks: () => UseQueryResult<
    inferRouterOutputs<AppRouter>["bookmarks"]["getUserBookmarks"],
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
      trpc.bookmarks.getUserBookmarks.queryOptions(undefined, {
        enabled: isAuthenticated,
        staleTime: Infinity,
      }),
    );
  }

  function useUpdateFolgenBookmark(folgeId: number, isBookmarked: boolean) {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    const bookmarkMutation = useMutation(
      trpc.bookmarks.addBookmark.mutationOptions({
        async onError() {
          await invalidate();
        },
        onMutate({ folgeId }) {
          queryClient.setQueryData(
            trpc.bookmarks.getUserBookmarks.queryKey(),
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
            trpc.bookmarks.getUserBookmarks.queryKey(),
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
        queryKey: trpc.bookmarks.getUserBookmarks.queryKey(),
      });
    }

    function toggleBookmark() {
      if (isBookmarked) {
        removeBookmarkMutation.mutate({ folgeId });
      } else {
        bookmarkMutation.mutate({ folgeId });
      }
    }

    return {
      isLoading: bookmarkMutation.isPending || removeBookmarkMutation.isPending,
      toggleBookmark,
    };
  }

  return {
    useUpdateFolgenBookmark,
    useUserBookmarks,
  };
}
