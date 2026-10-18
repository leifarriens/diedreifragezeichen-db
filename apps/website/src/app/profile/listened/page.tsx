import type { Metadata } from "next";

import { selectCollectionFolgen } from "@ddfdb/core";
import { l } from "@ddfdb/core/labels";
import { Suspense } from "react";

import { PageLoadingIndicator } from "@/components/ui/loading-indicator/loading-indicator";
import { Wrapper } from "@/components/ui/wrapper";
import { UserCollection } from "@/features/profile/components/user-collection";
import { getFolgeListItems } from "@/server/queries/folgen";
import { getMyListenedFolgen } from "@/server/queries/user-data";

export const metadata: Metadata = {
  title: l.LISTENED.TITLE,
};

export default function ListenedPage() {
  return (
    <Wrapper className="max-w-7xl">
      <h1 className="mb-8 text-3xl font-bold">{l.LISTENED.TITLE}</h1>

      <Suspense fallback={<PageLoadingIndicator />}>
        <ListenedContent />
      </Suspense>
    </Wrapper>
  );
}

async function ListenedContent() {
  const [folgen, userListened] = await Promise.all([
    getFolgeListItems(),
    getMyListenedFolgen(),
  ]);

  const userListenedFolgen = selectCollectionFolgen(folgen, userListened);

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
