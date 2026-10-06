import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "@/lib/use-auth";
import { useTRPC } from "@/trpc/client";

export function useFolgenBookmark(folgeId: number) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  const isBookmarkedQuery = useQuery(
    trpc.bookmarks.isBookmarked.queryOptions(
      { folgeId },
      {
        enabled: isAuthenticated,
      },
    ),
  );

  const bookmarkMutation = useMutation(
    trpc.bookmarks.addBookmark.mutationOptions({
      onMutate({ folgeId }) {
        queryClient.setQueryData(
          trpc.bookmarks.isBookmarked.queryKey({ folgeId }),
          true,
        );
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
      onMutate({ folgeId }) {
        queryClient.setQueryData(
          trpc.bookmarks.isBookmarked.queryKey({ folgeId }),
          false,
        );
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

  function toggleBookmark() {
    if (isBookmarkedQuery.data) {
      removeBookmarkMutation.mutate({ folgeId });
    } else {
      bookmarkMutation.mutate({ folgeId });
    }
  }

  return {
    isBookmarked: isBookmarkedQuery.data,
    isLoading:
      isBookmarkedQuery.isLoading ||
      bookmarkMutation.isPending ||
      removeBookmarkMutation.isPending,
    toggleBookmark,
  };
}
