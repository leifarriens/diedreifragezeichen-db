import type { Metadata } from "next";

import { selectCollectionFolgen } from "@ddfdb/core";
import { l } from "@ddfdb/core/labels";
import { Suspense } from "react";

import { PageLoadingIndicator } from "@/components/ui/loading-indicator/loading-indicator";
import { Wrapper } from "@/components/ui/wrapper";
import { UserListenedFolgen } from "@/features/listened/user-listened-folgen";
import { getAllFolgenWithCommunityRatings } from "@/server/queries/folgen";
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
    getAllFolgenWithCommunityRatings(),
    getMyListenedFolgen(),
  ]);

  const userListenedFolgen = selectCollectionFolgen(folgen, userListened);

  return <UserListenedFolgen folgen={userListenedFolgen} />;
}
