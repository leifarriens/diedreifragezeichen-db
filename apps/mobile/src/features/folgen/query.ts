import type { Folge } from "../../api/types";
import type { SortOption } from "./sort";

import dayjs from "../../lib/date";

export interface FolgenDateRange {
  endDate: null | string;
  startDate: null | string;
}

export interface FolgenQuery {
  dateRange: (range: FolgenDateRange) => FolgenQuery;
  results: () => Folge[];
  search: (term: string) => FolgenQuery;
  showSpecials: (show: boolean) => FolgenQuery;
  sort: (sortBy: SortOption) => FolgenQuery;
}

interface QueryOptions {
  dateRange?: FolgenDateRange;
  search?: string;
  showSpecials?: boolean;
  sortBy?: SortOption;
}

/**
 * Creates a lazy, immutable query over an arbitrary set of episodes.
 * Only the operations explicitly configured on the query are applied.
 */
export function createFolgenQuery(folgen: readonly Folge[]): FolgenQuery {
  return createQuery(folgen, {});
}

function compareDates(a: string, b: string, direction: -1 | 1) {
  const aTime = dayjs(a).valueOf();
  const bTime = dayjs(b).valueOf();
  const aIsValid = Number.isFinite(aTime);
  const bIsValid = Number.isFinite(bTime);

  if (aIsValid !== bIsValid) {
    return aIsValid ? -1 : 1;
  }

  if (!aIsValid || !bIsValid) {
    return 0;
  }

  return (aTime - bTime) * direction;
}

function compareFolgen(a: Folge, b: Folge, sortBy: SortOption) {
  switch (sortBy) {
    case "dateAsc":
      return compareDates(a.release_date, b.release_date, 1);
    case "dateDesc":
      return compareDates(a.release_date, b.release_date, -1);
    case "popularity":
      return b.popularity - a.popularity;
    case "rating":
      return b.rating - a.rating;
  }
}

function createQuery(
  folgen: readonly Folge[],
  options: QueryOptions,
): FolgenQuery {
  return {
    dateRange: (range) =>
      createQuery(folgen, {
        ...options,
        dateRange: { endDate: range.endDate, startDate: range.startDate },
      }),
    results: () => {
      let results = [...folgen];

      if (options.search) {
        results = filterBySearch(results, options.search);
      }

      if (options.dateRange) {
        results = filterByDateRange(results, options.dateRange);
      }

      if (options.showSpecials === false) {
        results = results.filter((folge) => folge.type !== "special");
      }

      const sortBy = options.sortBy;
      if (sortBy) {
        results.sort((a, b) => compareFolgen(a, b, sortBy));
      }

      return results;
    },
    search: (term) => {
      const nextOptions = { ...options };
      const trimmedTerm = term.trim();

      if (trimmedTerm) {
        nextOptions.search = trimmedTerm;
      } else {
        delete nextOptions.search;
      }

      return createQuery(folgen, nextOptions);
    },
    showSpecials: (show) =>
      createQuery(folgen, { ...options, showSpecials: show }),
    sort: (sortBy) => createQuery(folgen, { ...options, sortBy }),
  };
}

function filterByDateRange(
  folgen: readonly Folge[],
  { endDate, startDate }: FolgenDateRange,
) {
  if (startDate === null && endDate === null) {
    return [...folgen];
  }

  return folgen.filter((folge) => {
    const releaseDate = dayjs(folge.release_date);
    return (
      releaseDate.isValid() &&
      (startDate === null ||
        releaseDate.isSameOrAfter(dayjs(startDate), "day")) &&
      (endDate === null || releaseDate.isSameOrBefore(dayjs(endDate), "day"))
    );
  });
}

function filterBySearch(folgen: readonly Folge[], term: string) {
  const normalizedTerm = term.toLowerCase();

  return folgen.filter((folge) => {
    if (
      folge.name.toLowerCase().includes(normalizedTerm) ||
      folge.number.toLowerCase().includes(normalizedTerm)
    ) {
      return true;
    }

    return dayjs(folge.release_date).year().toString() === term;
  });
}
