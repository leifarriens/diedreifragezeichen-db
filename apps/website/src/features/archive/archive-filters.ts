export const FIRST_RELEASE_YEAR = 1979;

export interface ArchiveFilters {
  authors: string[];
  includeSpecials: boolean;
  roles: string[];
  scriptAuthors: string[];
  searchTerm: string;
  sortOrder: "newest" | "oldest" | "popularity" | "rating";
  speakers: string[];
  yearRange: { max: number; min: number };
}

export function readArchiveFilters(
  search: string,
  currentYear: number,
): ArchiveFilters {
  const params = new URLSearchParams(search);
  const sortOrder = params.get("sort");
  const max = Math.max(
    readYear(params.get("yearTo"), currentYear, currentYear),
    FIRST_RELEASE_YEAR + 1,
  );
  const min = Math.min(
    readYear(params.get("yearFrom"), FIRST_RELEASE_YEAR, currentYear),
    max - 1,
  );

  return {
    authors: readList(params, "authors"),
    includeSpecials: params.get("specials") !== "0",
    roles: readList(params, "roles"),
    scriptAuthors: readList(params, "scriptAuthors"),
    searchTerm: params.get("q") ?? "",
    sortOrder:
      sortOrder === "oldest" ||
      sortOrder === "rating" ||
      sortOrder === "popularity"
        ? sortOrder
        : "newest",
    speakers: readList(params, "speakers"),
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
    sort: filters.sortOrder === "newest" ? null : filters.sortOrder,
    specials: filters.includeSpecials ? null : "0",
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

  writeList(params, "authors", filters.authors);
  writeList(params, "roles", filters.roles);
  writeList(params, "scriptAuthors", filters.scriptAuthors);
  writeList(params, "speakers", filters.speakers);

  return params.toString();
}

function readList(params: URLSearchParams, key: string): string[] {
  return [...new Set(params.getAll(key).filter((value) => value.length > 0))];
}

function readYear(value: null | string, fallback: number, currentYear: number) {
  if (!value || !/^\d+$/.test(value)) return fallback;
  const year = Number(value);
  if (!Number.isSafeInteger(year)) return fallback;
  return Math.min(Math.max(year, FIRST_RELEASE_YEAR), currentYear);
}

function writeList(params: URLSearchParams, key: string, values: string[]) {
  params.delete(key);
  for (const value of values) {
    if (value.length > 0) params.append(key, value);
  }
}
