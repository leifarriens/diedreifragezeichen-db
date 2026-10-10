import { selectCollectionFolgen } from "@ddfdb/core";

import { UserBookmarkedFolgen } from "@/features/bookmarks/user-bookmarked-folgen";
import { serverSessionGuard } from "@/server/auth";
import { getAllFolgenWithCommunityRatings } from "@/server/queries/folgen";
import { caller } from "@/trpc/server";

export default async function BookmarksPage() {
  await serverSessionGuard();

  const [folgen, userBookmarks] = await Promise.all([
    getAllFolgenWithCommunityRatings(),
    caller.bookmarks.getUserBookmarks(),
  ]);

  const userBookmarkedFolgen = selectCollectionFolgen(folgen, userBookmarks);

  return (
    <main>
      <UserBookmarkedFolgen folgen={userBookmarkedFolgen} />
    </main>
  );
}
