import type { Metadata } from "next";

import { selectCollectionFolgen } from "@ddfdb/core";
import { l } from "@ddfdb/core/labels";
import { Suspense } from "react";

import { PageLoadingIndicator } from "@/components/ui/loading-indicator/loading-indicator";
import { Wrapper } from "@/components/ui/wrapper";
import { UserRatedFolgen } from "@/features/ratings/user-rated-folgen";
import { getAllFolgenWithCommunityRatings } from "@/server/queries/folgen";
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
    getAllFolgenWithCommunityRatings(),
    getMyRatings(),
  ]);

  const userRatedFolgen = selectCollectionFolgen(folgen, userRatings);

  return <UserRatedFolgen folgen={userRatedFolgen} />;
}
