import type { Metadata } from "next";

import { selectCollectionFolgen } from "@ddfdb/core";
import { Suspense } from "react";

import { PageLoadingIndicator } from "@/components/ui/loading-indicator/loading-indicator";
import { UserRatedFolgen } from "@/features/ratings/user-rated-folgen";
import { getAllFolgenWithCommunityRatings } from "@/server/queries/folgen";
import { getMyRatings } from "@/server/queries/user-data";

const TITLE = "Bewertete Folgen";

export const metadata: Metadata = {
  title: TITLE,
};

export default function RatingsPage() {
  return (
    <>
      <h1 className="mb-8 text-2xl font-bold">{TITLE}</h1>

      <Suspense fallback={<PageLoadingIndicator />}>
        <RatingsContent />
      </Suspense>
    </>
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
