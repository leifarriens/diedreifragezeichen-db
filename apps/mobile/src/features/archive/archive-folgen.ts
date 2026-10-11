import {
  createFolgenFilter,
  type FilterableFolge,
  type SortableFolge,
  sortFolgen,
} from "@ddfdb/core";

export interface ArchiveFolgenFilters {
  endDate: null | string;
  showSpecials: boolean;
  startDate: null | string;
}

export type ArchiveSortOrder = "newest" | "oldest" | "popularity" | "rating";

interface CommunityRatedFolge extends SortableFolge {
  communityRating: null | { popularity: number; score: number };
}

export function filterArchiveFolgen<T extends FilterableFolge>(
  folgen: readonly T[],
  searchTerm: string,
  filters: ArchiveFolgenFilters,
): T[] {
  return createFolgenFilter(folgen)
    .search(searchTerm)
    .showSpecials(filters.showSpecials)
    .yearRange({
      endYear: dateToYear(filters.endDate),
      startYear: dateToYear(filters.startDate),
    })
    .results();
}

export function sortArchiveFolgen<T extends CommunityRatedFolge>(
  folgen: readonly T[],
  sortOrder: ArchiveSortOrder,
): T[] {
  if (sortOrder === "rating") {
    return sortFolgen(folgen, { by: "communityRating", order: "highest" });
  }

  if (sortOrder === "popularity") {
    return sortFolgen(folgen, { by: "popularity", order: "highest" });
  }

  return sortFolgen(folgen, { by: "releaseDate", order: sortOrder });
}

function dateToYear(date: null | string): null | number {
  if (!date) return null;

  const year = Number(date.slice(0, 4));
  return Number.isSafeInteger(year) ? year : null;
}
