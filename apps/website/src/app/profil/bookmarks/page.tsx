import type { Metadata } from "next/types";

import { selectCollectionFolgen } from "@ddfdb/core";

import { UserBookmarkedFolgen } from "@/features/bookmarks/user-bookmarked-folgen";
import { serverSessionGuard } from "@/server/auth";
import { getAllFolgenWithCommunityRatings } from "@/server/queries/folgen";
import { caller } from "@/trpc/server";

const TITLE = "Gespeicherte Folgen";

export const metadata: Metadata = {
  title: TITLE,
};

export default async function BookmarksPage() {
  await serverSessionGuard();

  const [folgen, userBookmarks] = await Promise.all([
    getAllFolgenWithCommunityRatings(),
    caller.bookmarks.getMyBookmarks(),
  ]);

  const userBookmarkedFolgen = selectCollectionFolgen(folgen, userBookmarks);

  return (
    <>
      <h1 className="mb-8 text-2xl font-bold">{TITLE}</h1>
      <UserBookmarkedFolgen folgen={userBookmarkedFolgen} />
    </>
  );
}
