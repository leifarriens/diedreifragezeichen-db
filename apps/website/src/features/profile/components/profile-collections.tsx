"use client";

import { l } from "@ddfdb/core/labels";

import { PageLoadingIndicator } from "@/components/ui/loading-indicator/loading-indicator";
import { useUserBookmarkedFolgen } from "@/features/bookmarks/user-user-bookmarked-folgen";
import { useUserListenedFolgen } from "@/features/listened/use-user-listened-folgen";
import { useUserRatedFolgen } from "@/features/ratings/hooks/use-user-rated-folgen";

import { ProfileFolgenPreview } from "./profile-folgen-preview";

const PREVIEW_LIMIT = 3;

export function ProfileCollections() {
  const {
    isLoading,
    userBookmarkedFolgen,
    userListenedFolgen,
    userRatedFolgen,
  } = useUserCollectionPreview();

  if (isLoading) {
    return <PageLoadingIndicator />;
  }

  return (
    <>
      <ProfileFolgenPreview
        count={userRatedFolgen.length}
        emptyMessage={l.RATINGS.EMPTY_PLACEHOLDER}
        folgen={userRatedFolgen.slice(0, PREVIEW_LIMIT)}
        href="/profile/ratings"
        title={l.RATINGS.NAME}
      />

      <ProfileFolgenPreview
        count={userListenedFolgen.length}
        emptyMessage={l.LISTENED.EMPTY_PLACEHOLDER}
        folgen={userListenedFolgen.slice(0, PREVIEW_LIMIT)}
        href="/profile/listened"
        title={l.LISTENED.NAME}
      />

      <ProfileFolgenPreview
        count={userBookmarkedFolgen.length}
        emptyMessage={l.BOOKMARKS.EMPTY_PLACEHOLDER}
        folgen={userBookmarkedFolgen.slice(0, PREVIEW_LIMIT)}
        href="/profile/bookmarks"
        title={l.BOOKMARKS.NAME}
      />
    </>
  );
}

function useUserCollectionPreview() {
  const { data: userRatedFolgen, isLoading: isLoadingUserRatedFolgen } =
    useUserRatedFolgen();
  const { data: userListenedFolgen, isLoading: isLoadingUserListenedFolgen } =
    useUserListenedFolgen();
  const {
    data: userBookmarkedFolgen,
    isLoading: isLoadingUserBookmarkedFolgen,
  } = useUserBookmarkedFolgen();

  return {
    isLoading:
      isLoadingUserRatedFolgen ||
      isLoadingUserListenedFolgen ||
      isLoadingUserBookmarkedFolgen,
    userBookmarkedFolgen,
    userListenedFolgen,
    userRatedFolgen,
  };
}
