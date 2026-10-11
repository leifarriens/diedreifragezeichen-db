import type { Metadata } from "next";

import { selectCollectionFolgen } from "@ddfdb/core";

import { UserListenedFolgen } from "@/features/listened/user-listened-folgen";
import { serverSessionGuard } from "@/server/auth";
import { getAllFolgenWithCommunityRatings } from "@/server/queries/folgen";
import { caller } from "@/trpc/server";

const TITLE = "Gehörte Folgen";

export const metadata: Metadata = {
  title: TITLE,
};

export default async function ListenedPage() {
  await serverSessionGuard();

  const [folgen, userListened] = await Promise.all([
    getAllFolgenWithCommunityRatings(),
    caller.listened.getMyListenedFolgen(),
  ]);

  const userListenedFolgen = selectCollectionFolgen(folgen, userListened);

  return (
    <>
      <h1 className="mb-8 text-2xl font-bold">{TITLE}</h1>
      <UserListenedFolgen folgen={userListenedFolgen} />
    </>
  );
}
