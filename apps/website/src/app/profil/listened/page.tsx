import { selectCollectionFolgen } from "@ddfdb/core";

import { UserListenedFolgen } from "@/features/listened/user-listened-folgen";
import { serverSessionGuard } from "@/lib/auth";
import { folgenService } from "@/services/folgen.service";
import { caller } from "@/trpc/server";

export default async function ListenedPage() {
  await serverSessionGuard();

  const [folgen, userListened] = await Promise.all([
    folgenService.getAllFolgenWithCommunityRatings(),
    caller.listened.getUserListened(),
  ]);

  const userListenedFolgen = selectCollectionFolgen(folgen, userListened);

  return (
    <main>
      <UserListenedFolgen folgen={userListenedFolgen} />
    </main>
  );
}
