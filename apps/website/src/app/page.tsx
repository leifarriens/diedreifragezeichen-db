import type { Folge } from "@ddfdb/archiv/contracts";
import type { Metadata } from "next";

import { fetchArchiveFolgen } from "@/lib/archiv-api";

import ArchiveBrowser from "./archive-browser";

export const metadata: Metadata = {
  description:
    "Das Hörspielarchiv der drei ???. Entdecke Folgen, Erscheinungsjahre und Specials.",
  title: "Archiv",
};

export const dynamic = "force-static";
export const revalidate = 3600; // 1 hour

export default async function HomePage() {
  let folgen: Folge[] = [];
  let archiveUnavailable = false;

  try {
    folgen = await fetchArchiveFolgen();
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
