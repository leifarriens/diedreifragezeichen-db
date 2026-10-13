import { createHydrateFolgenWithUserDataHook } from "@ddfdb/client";

import { useUserBookmarks } from "@/features/bookmarks/use-bookmarks";
import { useUserListened } from "@/features/listened/use-listened";
import { useUserRatings } from "@/features/ratings/hooks/use-ratings";

export const { useHydrateFolgenWithUserData } =
  createHydrateFolgenWithUserDataHook({
    useUserBookmarks,
    useUserListened,
    useUserRatings,
  });
