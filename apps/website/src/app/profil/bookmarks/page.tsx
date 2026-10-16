import type { Metadata } from "next/types";

import { selectCollectionFolgen } from "@ddfdb/core";
import { l } from "@ddfdb/core/labels";
import { Suspense } from "react";

import { PageLoadingIndicator } from "@/components/ui/loading-indicator/loading-indicator";
import { Wrapper } from "@/components/ui/wrapper";
import { UserBookmarkedFolgen } from "@/features/bookmarks/user-bookmarked-folgen";
import { getAllFolgenWithCommunityRatings } from "@/server/queries/folgen";
import { getMyBookmarks } from "@/server/queries/user-data";

export const metadata: Metadata = {
  title: l.BOOKMARKS.TITLE,
};

export default function BookmarksPage() {
  return (
    <Wrapper className="max-w-7xl">
      <h1 className="mb-8 text-2xl font-bold">{l.BOOKMARKS.TITLE}</h1>

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

  return <UserBookmarkedFolgen folgen={userBookmarkedFolgen} />;
}
