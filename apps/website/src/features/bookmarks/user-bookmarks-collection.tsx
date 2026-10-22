"use client";

import { l } from "@ddfdb/core/labels";

import { PageLoadingIndicator } from "@/components/ui/loading-indicator/loading-indicator";

import { UserCollection } from "../profile/components/user-collection";
import { useUserBookmarkedFolgen } from "./user-user-bookmarked-folgen";

export function UserBookmarksCollection() {
  const { data: bookmarkedFolgen, isLoading } = useUserBookmarkedFolgen();

  if (isLoading) {
    return <PageLoadingIndicator />;
  }

  return (
    <UserCollection
      emptyMessage={l.BOOKMARKS.EMPTY_PLACEHOLDER}
      folgen={bookmarkedFolgen}
      initialSortValue="newest"
      searchPlaceholder={l.BOOKMARKS.SEARCH_PLACEHOLDER}
      sortLabel={l.BOOKMARKS.SORTING.LABEL}
      sortOptions={[
        {
          label: l.BOOKMARKS.SORTING.NEWEST_FIRST,
          sort: { by: "bookmarkedAt", order: "newest" },
          value: "newest",
        },
        {
          label: l.BOOKMARKS.SORTING.OLDEST_FIRST,
          sort: { by: "bookmarkedAt", order: "oldest" },
          value: "oldest",
        },
      ]}
    />
  );
}
