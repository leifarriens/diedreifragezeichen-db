import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useTRPC } from "@/api/user-api";

export function useUpdateFolgenBookmark(
  folgeId: number,
  isBookmarked: boolean,
) {
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
