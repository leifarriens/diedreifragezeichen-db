import { enrichFolgenWithUserData } from "@ddfdb/core";
import { useMemo } from "react";

import type { BookmarkHooks } from "../bookmarks/create-bookmark-hooks";
import type { ListenedHooks } from "../listened/create-listened-hooks";
import type { RatingHooks } from "../ratings/create-rating-hooks";

export interface HydrateFolgenWithUserDataHooks {
  useHydrateFolgenWithUserData: <T extends { id: number }>(folgen: T[]) => T[];
}

export function createHydrateFolgenWithUserDataHook({
  useUserBookmarks,
  useUserListened,
  useUserRatings,
}: {
  useUserBookmarks: BookmarkHooks["useUserBookmarks"];
  useUserListened: ListenedHooks["useUserListened"];
  useUserRatings: RatingHooks["useUserRatings"];
}) {
  function useHydrateFolgenWithUserData<T extends { id: number }>(folgen: T[]) {
    const { data: ratings } = useUserRatings();
    const { data: bookmarks } = useUserBookmarks();
    const { data: listened } = useUserListened();

    return useMemo(
      () => enrichFolgenWithUserData(folgen, { bookmarks, listened, ratings }),
      [folgen, bookmarks, listened, ratings],
    );
  }

  return {
    useHydrateFolgenWithUserData,
  };
}
