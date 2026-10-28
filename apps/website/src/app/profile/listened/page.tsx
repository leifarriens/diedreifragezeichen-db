import type { Metadata } from "next";

import { l } from "@ddfdb/core/labels";

import { Wrapper } from "@/components/ui/wrapper";
import { UserListenedCollection } from "@/features/listened/user-listened-collection";

export const metadata: Metadata = {
  title: l.LISTENED.TITLE,
};

export default function ListenedPage() {
  return (
    <Wrapper className="max-w-7xl">
      <h1 className="mb-8 text-3xl font-bold">{l.LISTENED.TITLE}</h1>

      <UserListenedCollection />
    </Wrapper>
  );
}
