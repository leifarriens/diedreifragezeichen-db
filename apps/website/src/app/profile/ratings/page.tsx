import type { Metadata } from "next";

import { l } from "@ddfdb/core/labels";

import { Wrapper } from "@/components/ui/wrapper";
import { UserRatingsCollection } from "@/features/ratings/components/user-ratings-collection";

export const metadata: Metadata = {
  title: l.RATINGS.TITLE,
};

export default function RatingsPage() {
  return (
    <Wrapper className="max-w-7xl">
      <h1 className="mb-8 text-3xl font-bold">{l.RATINGS.TITLE}</h1>

      <UserRatingsCollection />
    </Wrapper>
  );
}
