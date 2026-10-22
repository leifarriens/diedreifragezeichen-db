import type { Metadata } from "next/types";

import { l } from "@ddfdb/core/labels";

import { Wrapper } from "@/components/ui/wrapper";
import { UserBookmarksCollection } from "@/features/bookmarks/user-bookmarks-collection";

export const metadata: Metadata = {
  title: l.BOOKMARKS.TITLE,
};

export default function BookmarksPage() {
  return (
    <Wrapper className="max-w-7xl">
      <h1 className="mb-8 text-3xl font-bold">{l.BOOKMARKS.TITLE}</h1>

      <UserBookmarksCollection />
    </Wrapper>
  );
}
