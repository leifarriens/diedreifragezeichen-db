import { UserBookmarkedFolgen } from "@/features/bookmarks/user-bookmarked-folgen";
import { serverSessionGuard } from "@/lib/auth";
import { folgenService } from "@/services/folgen.service";
import { caller } from "@/trpc/server";

export default async function BookmarksPage() {
  await serverSessionGuard();

  const [folgen, userBookmarks] = await Promise.all([
    folgenService.getAllFolgenWithCommunityRatings(),
    caller.bookmarks.getUserBookmarks(),
  ]);

  const userBookmarkedFolgenIds = new Set<number>(
    userBookmarks.map(({ folgeId }) => folgeId),
  );

  const userBookmarkedFolgen = folgen.filter((folge) =>
    userBookmarkedFolgenIds.has(folge.id),
  );

  return (
    <main>
      <UserBookmarkedFolgen folgen={userBookmarkedFolgen} />
    </main>
  );
}
