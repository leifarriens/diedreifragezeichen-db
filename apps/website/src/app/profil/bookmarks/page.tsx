import type { Metadata } from "next/types";

import { selectCollectionFolgen } from "@ddfdb/core";
import { Suspense } from "react";

import { PageLoadingIndicator } from "@/components/ui/loading-indicator/loading-indicator";
import { UserBookmarkedFolgen } from "@/features/bookmarks/user-bookmarked-folgen";
import { getAllFolgenWithCommunityRatings } from "@/server/queries/folgen";
import { getMyBookmarks } from "@/server/queries/user-data";

const TITLE = "Gespeicherte Folgen";

export const metadata: Metadata = {
  title: TITLE,
};

export default function BookmarksPage() {
  return (
    <>
      <h1 className="mb-8 text-2xl font-bold">{TITLE}</h1>

      <Suspense fallback={<PageLoadingIndicator />}>
        <BookmarksContent />
      </Suspense>
    </>
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
