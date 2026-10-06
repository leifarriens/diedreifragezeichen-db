import { redirect } from "next/navigation";

import { getServerSession } from "@/lib/auth";
import { folgenService } from "@/services/folgen.service";
import { caller } from "@/trpc/server";

import { BookmarksList } from "./bookmarks-list";

export default async function BookmarksPage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  const [folgen, userRatings, userBookmarks] = await Promise.all([
    folgenService.getAllFolgenWithCommunityRatings(),
    caller.ratings.getMine(),
    caller.bookmarks.getUserBookmarks(),
  ]);

  const userRatingsByFolgeId = new Map(
    userRatings.map((rating) => [rating.folgeId, rating]),
  );

  const userBookmarksByFolgeId = new Map(
    userBookmarks.map((bookmark) => [bookmark.folgeId, bookmark]),
  );

  // TODO: Keep the hydration to the client
  const hydratedFolgen = folgen.flatMap((folge) => {
    const userRating = userRatingsByFolgeId.get(folge.id);

    const userBookmark = userBookmarksByFolgeId.get(folge.id);

    return userBookmark
      ? [
          {
            ...folge,
            isBookmarked: true,
            userRating: userRating?.score,
          },
        ]
      : [];
  });

  return (
    <main>
      <section>
        <BookmarksList folgen={hydratedFolgen} />
      </section>
    </main>
  );
}
