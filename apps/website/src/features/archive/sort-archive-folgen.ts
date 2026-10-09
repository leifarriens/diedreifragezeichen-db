import type { FolgeWithCommunityRating } from "@ddfdb/core";

import { sortFolgen } from "@ddfdb/core";

export type ArchiveSortOrder = "newest" | "oldest" | "rating";

type SortableFolge = Pick<
  FolgeWithCommunityRating,
  "communityRating" | "id" | "release_date" | "title"
>;

export function sortArchiveFolgen<T extends SortableFolge>(
  folgen: T[],
  sortOrder: ArchiveSortOrder,
): T[] {
  if (sortOrder === "rating") {
    return sortFolgen(folgen, { by: "communityRating", order: "highest" });
  }

  return sortFolgen(folgen, { by: "releaseDate", order: sortOrder });
}
