import { selectCollectionFolgen } from "@ddfdb/core";

import { UserRatedFolgen } from "@/features/ratings/user-rated-folgen";
import { serverSessionGuard } from "@/lib/auth";
import { folgenService } from "@/services/folgen.service";
import { caller } from "@/trpc/server";

export default async function RatingsPage() {
  await serverSessionGuard();

  const [folgen, userRatings] = await Promise.all([
    folgenService.getAllFolgenWithCommunityRatings(),
    caller.ratings.getMine(),
  ]);

  const userRatedFolgen = selectCollectionFolgen(folgen, userRatings);

  return (
    <main>
      <UserRatedFolgen folgen={userRatedFolgen} />
    </main>
  );
}
