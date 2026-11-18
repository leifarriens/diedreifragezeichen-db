"use client";

import { l } from "@ddfdb/core/labels";

import { PageLoadingIndicator } from "@/components/ui/loading-indicator/loading-indicator";

import { UserCollection } from "../profile/components/user-collection";
import { useUserListenedFolgen } from "./use-user-listened-folgen";

export function UserListenedCollection() {
  const { data: userListenedFolgen, isLoading } = useUserListenedFolgen();

  if (isLoading) {
    return <PageLoadingIndicator />;
  }

  return (
    <UserCollection
      emptyMessage={l.LISTENED.EMPTY_PLACEHOLDER}
      folgen={userListenedFolgen}
      initialSortValue="newest"
      searchPlaceholder={l.LISTENED.SEARCH_PLACEHOLDER}
      sortLabel={l.LISTENED.SORTING.LABEL}
      sortOptions={[
        {
          label: l.LISTENED.SORTING.NEWEST_FIRST,
          sort: { by: "listenedAt", order: "newest" },
          value: "newest",
        },
        {
          label: l.LISTENED.SORTING.OLDEST_FIRST,
          sort: { by: "listenedAt", order: "oldest" },
          value: "oldest",
        },
      ]}
    />
  );
}
