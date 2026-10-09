import type { Metadata } from "next";

import type { FolgeWithCommunityRating } from "@/lib/types";

import ArchiveBrowser from "@/features/archive/components/archive-browser";

import { folgenService } from "../services/folgen.service";

export const metadata: Metadata = {
  description:
    "Das Hörspielarchiv der drei ???. Entdecke Folgen, Erscheinungsjahre und Specials.",
  title: "Archiv",
};

export const dynamic = "force-static";
export const revalidate = 3600; // 1 hour

export default async function HomePage() {
  let folgen: FolgeWithCommunityRating[] = [];
  let archiveUnavailable = false;

  try {
    folgen = await folgenService.getAllFolgenWithCommunityRatings();
  } catch (error) {
    console.error("Could not load Folgen from the Archiv API", error);
    archiveUnavailable = true;
  }

  return (
    <main>
      <ArchiveBrowser archiveUnavailable={archiveUnavailable} folgen={folgen} />
    </main>
  );
}
