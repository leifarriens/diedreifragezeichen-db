export const FIRST_RELEASE_YEAR = 1979;

export interface ArchiveFilters {
  includeSpecials: boolean;
  searchTerm: string;
  sortOrder: "newest" | "oldest";
  yearRange: { max: number; min: number };
}

export function readArchiveFilters(
  search: string,
  currentYear: number,
): ArchiveFilters {
  const params = new URLSearchParams(search);
  const max = Math.max(
    readYear(params.get("yearTo"), currentYear, currentYear),
    FIRST_RELEASE_YEAR + 1,
  );
  const min = Math.min(
    readYear(params.get("yearFrom"), FIRST_RELEASE_YEAR, currentYear),
    max - 1,
  );

  return {
    includeSpecials: params.get("specials") === "1",
    searchTerm: params.get("q") ?? "",
    sortOrder: params.get("sort") === "oldest" ? "oldest" : "newest",
    yearRange: { max, min },
  };
}

export function writeArchiveFilters(
  search: string,
  filters: ArchiveFilters,
  currentYear: number,
): string {
  const params = new URLSearchParams(search);
  const values = {
    q: filters.searchTerm || null,
    sort: filters.sortOrder === "oldest" ? "oldest" : null,
    specials: filters.includeSpecials ? "1" : null,
    yearFrom:
      filters.yearRange.min === FIRST_RELEASE_YEAR
        ? null
        : filters.yearRange.min.toString(),
    yearTo:
      filters.yearRange.max === currentYear
        ? null
        : filters.yearRange.max.toString(),
  };

  for (const [key, value] of Object.entries(values)) {
    if (value === null) params.delete(key);
    else params.set(key, value);
  }

  return params.toString();
}

function readYear(value: null | string, fallback: number, currentYear: number) {
  if (!value || !/^\d+$/.test(value)) return fallback;
  const year = Number(value);
  if (!Number.isSafeInteger(year)) return fallback;
  return Math.min(Math.max(year, FIRST_RELEASE_YEAR), currentYear);
}
