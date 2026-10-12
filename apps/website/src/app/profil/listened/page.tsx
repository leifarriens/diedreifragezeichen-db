import type { Metadata } from "next";

import { selectCollectionFolgen } from "@ddfdb/core";
import { Suspense } from "react";

import { PageLoadingIndicator } from "@/components/ui/loading-indicator/loading-indicator";
import { UserListenedFolgen } from "@/features/listened/user-listened-folgen";
import { getAllFolgenWithCommunityRatings } from "@/server/queries/folgen";
import { getMyListenedFolgen } from "@/server/queries/user-data";

const TITLE = "Gehörte Folgen";

export const metadata: Metadata = {
  title: TITLE,
};

export default function ListenedPage() {
  return (
    <>
      <h1 className="mb-8 text-2xl font-bold">{TITLE}</h1>

      <Suspense fallback={<PageLoadingIndicator />}>
        <ListenedContent />
      </Suspense>
    </>
  );
}

async function ListenedContent() {
  const [folgen, userListened] = await Promise.all([
    getAllFolgenWithCommunityRatings(),
    getMyListenedFolgen(),
  ]);

  const userListenedFolgen = selectCollectionFolgen(folgen, userListened);

  return <UserListenedFolgen folgen={userListenedFolgen} />;
}
