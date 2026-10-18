import type { Metadata } from "next";

import { selectCollectionFolgen } from "@ddfdb/core";
import { l } from "@ddfdb/core/labels";
import { Suspense } from "react";

import { PageLoadingIndicator } from "@/components/ui/loading-indicator/loading-indicator";
import { Wrapper } from "@/components/ui/wrapper";
import { UserCollection } from "@/features/profile/components/user-collection";
import { getFolgeListItems } from "@/server/queries/folgen";
import { getMyRatings } from "@/server/queries/user-data";

export const metadata: Metadata = {
  title: l.RATINGS.TITLE,
};

export default function RatingsPage() {
  return (
    <Wrapper className="max-w-7xl">
      <h1 className="mb-8 text-3xl font-bold">{l.RATINGS.TITLE}</h1>

      <Suspense fallback={<PageLoadingIndicator />}>
        <RatingsContent />
      </Suspense>
    </Wrapper>
  );
}

async function RatingsContent() {
  const [folgen, userRatings] = await Promise.all([
    getFolgeListItems(),
    getMyRatings(),
  ]);

  const userRatedFolgen = selectCollectionFolgen(folgen, userRatings);

  return (
    <UserCollection
      emptyMessage={l.RATINGS.EMPTY_PLACEHOLDER}
      folgen={userRatedFolgen}
      initialSortValue="recent"
      searchPlaceholder={l.RATINGS.SEARCH_PLACEHOLDER}
      sortLabel={l.RATINGS.SORTING.LABEL}
      sortOptions={[
        {
          label: l.RATINGS.SORTING.NEWEST_FIRST,
          sort: { by: "userRatingUpdatedAt", order: "newest" },
          value: "recent",
        },
        {
          label: l.RATINGS.SORTING.HIGHEST_RATED_FIRST,
          sort: { by: "userRating", order: "highest" },
          value: "highest",
        },
        {
          label: l.RATINGS.SORTING.LOWEST_RATED_FIRST,
          sort: { by: "userRating", order: "lowest" },
          value: "lowest",
        },
      ]}
    />
  );
}
