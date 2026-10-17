import type { Metadata } from "next/types";

import { selectCollectionFolgen } from "@ddfdb/core";
import { l } from "@ddfdb/core/labels";
import { Suspense } from "react";

import { PageLoadingIndicator } from "@/components/ui/loading-indicator/loading-indicator";
import { Wrapper } from "@/components/ui/wrapper";
import { UserCollection } from "@/features/profile/components/user-collection";
import { getAllFolgenWithCommunityRatings } from "@/server/queries/folgen";
import { getMyBookmarks } from "@/server/queries/user-data";

export const metadata: Metadata = {
  title: l.BOOKMARKS.TITLE,
};

export default function BookmarksPage() {
  return (
    <Wrapper className="max-w-7xl">
      <h1 className="mb-8 text-3xl font-bold">{l.BOOKMARKS.TITLE}</h1>

      <Suspense fallback={<PageLoadingIndicator />}>
        <BookmarksContent />
      </Suspense>
    </Wrapper>
  );
}

async function BookmarksContent() {
  const [folgen, userBookmarks] = await Promise.all([
    getAllFolgenWithCommunityRatings(),
    getMyBookmarks(),
  ]);

  const userBookmarkedFolgen = selectCollectionFolgen(folgen, userBookmarks);

  return (
    <UserCollection
      emptyMessage={l.BOOKMARKS.EMPTY_PLACEHOLDER}
      folgen={userBookmarkedFolgen}
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
