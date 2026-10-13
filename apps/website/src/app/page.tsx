import type { Metadata } from "next";

import ArchiveBrowser from "@/features/archive/components/archive-browser";
import { getAllFolgenWithCommunityRatings } from "@/server/queries/folgen";

import { SITE_DESCRIPTION, SITE_NAME } from "./constants";

export const metadata: Metadata = {
  description: SITE_DESCRIPTION,
  title: `Archiv | ${SITE_NAME}`,
};

export default async function HomePage() {
  const folgen = await getAllFolgenWithCommunityRatings();

  return (
    <main>
      <ArchiveBrowser folgen={folgen} />
    </main>
  );
}
