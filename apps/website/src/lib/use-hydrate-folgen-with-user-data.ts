import { enrichFolgenWithUserData, type FolgeUserData } from "@ddfdb/core";
import { useMemo } from "react";

import { useUserBookmarks } from "@/features/bookmarks/use-bookmarks";
import { useUserListened } from "@/features/listened/use-listened";
import { useUserRatings } from "@/features/ratings/hooks/use-ratings";

/**
 * Hydrates an array of Folgen with the user's bookmark, listening and rating data.
 */
export function useHydrateFolgenWithUserData<T extends { id: number }>(
  folgen: T[],
): (FolgeUserData & T)[] {
  const { data: ratings } = useUserRatings();
  const { data: bookmarks } = useUserBookmarks();
  const { data: listened } = useUserListened();

  return useMemo(
    () => enrichFolgenWithUserData(folgen, { bookmarks, listened, ratings }),
    [folgen, bookmarks, listened, ratings],
  );
}
