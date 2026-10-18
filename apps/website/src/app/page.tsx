import type { Metadata } from "next";

import ArchiveBrowser from "@/features/archive/components/archive-browser";
import { getFolgeListItems } from "@/server/queries/folgen";
import { getAllFolgenSearchOptions } from "@/server/queries/search";
import { PageBackground } from "@/shell/page-background";

import { SITE_NAME } from "./constants";

const title = `Archiv | ${SITE_NAME}`;

export const metadata: Metadata = {
  title,
};

export default async function HomePage() {
  const [folgen, searchOptions] = await Promise.all([
    getFolgeListItems(),
    getAllFolgenSearchOptions(),
  ]);

  const backgroundArtwork = folgen[0]?.artwork;

  return (
    <>
      <main>
        <ArchiveBrowser availableOptions={searchOptions} folgen={folgen} />
      </main>

      {backgroundArtwork && <PageBackground artwork={backgroundArtwork} />}
    </>
  );
}
