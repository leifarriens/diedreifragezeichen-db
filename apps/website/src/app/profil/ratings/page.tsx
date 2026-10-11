import { selectCollectionFolgen } from "@ddfdb/core";

import { UserRatedFolgen } from "@/features/ratings/user-rated-folgen";
import { serverSessionGuard } from "@/server/auth";
import { getAllFolgenWithCommunityRatings } from "@/server/queries/folgen";
import { caller } from "@/trpc/server";

export default async function RatingsPage() {
  await serverSessionGuard();

  const [folgen, userRatings] = await Promise.all([
    getAllFolgenWithCommunityRatings(),
    caller.ratings.getMyRatings(),
  ]);

  const userRatedFolgen = selectCollectionFolgen(folgen, userRatings);

  return (
    <main>
      <UserRatedFolgen folgen={userRatedFolgen} />
    </main>
  );
}
