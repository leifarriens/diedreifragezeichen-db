import type { Metadata } from "next";

import { formatRelativeTime, selectCollectionFolgen } from "@ddfdb/core";
import { l } from "@ddfdb/core/labels";
import Link from "next/link";
import { Suspense } from "react";

import { GearIcon } from "@/components/icons";
import { Avatar } from "@/components/ui/avatar";
import { PageLoadingIndicator } from "@/components/ui/loading-indicator/loading-indicator";
import { Wrapper } from "@/components/ui/wrapper";
import { getFolgeListItems } from "@/server/queries/folgen";
import {
  getMe,
  getMyBookmarks,
  getMyListenedFolgen,
  getMyRatings,
} from "@/server/queries/user-data";

import { ProfileFolgenPreview } from "../../features/profile/components/profile-bookmarks-preview";

const TITLE = "Profil";

export const metadata: Metadata = {
  title: TITLE,
};

export default function ProfilePage() {
  return (
    <Wrapper className="max-w-4xl">
      <h1 className="mb-8 text-3xl font-bold">{TITLE}</h1>

      <Suspense fallback={<PageLoadingIndicator />}>
        <ProfileData />
      </Suspense>
    </Wrapper>
  );
}

async function ProfileData() {
  const [user, folgen, userRatings, userListened, userBookmarks] =
    await Promise.all([
      getMe(),
      getFolgeListItems(),
      getMyRatings(),
      getMyListenedFolgen(),
      getMyBookmarks(),
    ]);

  const userRatedFolgen = selectCollectionFolgen(folgen, userRatings, 3);
  const userListenedFolgen = selectCollectionFolgen(folgen, userListened, 3);
  const userBookmarkedFolgen = selectCollectionFolgen(folgen, userBookmarks, 3);

  return (
    <div className="space-y-16">
      <section className="flex">
        <div className="flex grow gap-x-4">
          <Avatar name={user.name} size="large" />
          <div>
            <p className="text-xl font-bold">{user.name}</p>
            <p>Beigetreten {formatRelativeTime(user.createdAt)}</p>
          </div>
        </div>
        <div>
          <Link href="/profile/account" title="Kontoeinstellungen">
            <GearIcon className="size-6" />
          </Link>
        </div>
      </section>

      <ProfileFolgenPreview
        count={userRatings.length}
        emptyMessage={l.RATINGS.EMPTY_PLACEHOLDER}
        folgen={userRatedFolgen}
        href="/profile/ratings"
        title={l.RATINGS.NAME}
      />

      <ProfileFolgenPreview
        count={userListened.length}
        emptyMessage={l.LISTENED.EMPTY_PLACEHOLDER}
        folgen={userListenedFolgen}
        href="/profile/listened"
        title={l.LISTENED.NAME}
      />

      <ProfileFolgenPreview
        count={userBookmarks.length}
        emptyMessage={l.BOOKMARKS.EMPTY_PLACEHOLDER}
        folgen={userBookmarkedFolgen}
        href="/profile/bookmarks"
        title={l.BOOKMARKS.NAME}
      />
    </div>
  );
}
