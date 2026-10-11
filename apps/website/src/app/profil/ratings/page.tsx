import type { Metadata } from "next";

import { selectCollectionFolgen } from "@ddfdb/core";

import { UserRatedFolgen } from "@/features/ratings/user-rated-folgen";
import { serverSessionGuard } from "@/server/auth";
import { getAllFolgenWithCommunityRatings } from "@/server/queries/folgen";
import { caller } from "@/trpc/server";

const TITLE = "Bewertete Folgen";

export const metadata: Metadata = {
  title: TITLE,
};

export default async function RatingsPage() {
  await serverSessionGuard();

  const [folgen, userRatings] = await Promise.all([
    getAllFolgenWithCommunityRatings(),
    caller.ratings.getMyRatings(),
  ]);

  const userRatedFolgen = selectCollectionFolgen(folgen, userRatings);

  return (
    <>
      <h1 className="mb-8 text-2xl font-bold">{TITLE}</h1>
      <UserRatedFolgen folgen={userRatedFolgen} />
    </>
  );
}
