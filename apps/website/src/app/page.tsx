import type { Metadata } from "next";

import ArchiveBrowser from "@/features/archive/components/archive-browser";
import { getAllFolgenWithCommunityRatings } from "@/server/queries/folgen";
import { getAllFolgenSearchOptions } from "@/server/queries/search";

import { SITE_NAME } from "./constants";

const title = `Archiv | ${SITE_NAME}`;

export const metadata: Metadata = {
  title,
};

export default async function HomePage() {
  const folgen = await getAllFolgenWithCommunityRatings();
  const searchOptions = await getAllFolgenSearchOptions();

  return (
    <main>
      <ArchiveBrowser availableOptions={searchOptions} folgen={folgen} />
    </main>
  );
}
