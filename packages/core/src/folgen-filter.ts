export interface FilterableFolge {
  collection: string;
  number: null | number;
  release_date: null | string;
  title: string;
}

export interface FolgenYearRange {
  endYear: null | number;
  startYear: null | number;
}

interface RatedFolge {
  userRating: null | number;
}

class FolgenFilter<T extends FilterableFolge> {
  constructor(
    private readonly folgen: readonly T[],
    private readonly searchTerm = "",
    private readonly includeSpecials = true,
    private readonly selectedYearRange: FolgenYearRange | null = null,
    private readonly includeUserRated = true,
  ) {}

  results(): T[] {
    const query = this.searchTerm.trim().toLocaleLowerCase("de-DE");
    const { endYear, startYear } = this.selectedYearRange ?? {
      endYear: null,
      startYear: null,
    };
    const hasYearRange = startYear !== null || endYear !== null;

    return this.folgen.filter((folge) => {
      if (!this.includeSpecials && folge.collection === "spezial") return false;

      if (hasYearRange) {
        if (!folge.release_date) return false;

        const year = Number(folge.release_date.slice(0, 4));
        if (!Number.isSafeInteger(year)) return false;
        if (startYear !== null && year < startYear) return false;
        if (endYear !== null && year > endYear) return false;
      }

      if (
        !this.includeUserRated &&
        "userRating" in folge &&
        folge.userRating !== null &&
        folge.userRating !== undefined
      ) {
        return false;
      }

      return matchesSearchTerm(folge, query);
    });
  }

  search(searchTerm: string): FolgenFilter<T> {
    return new FolgenFilter(
      this.folgen,
      searchTerm,
      this.includeSpecials,
      this.selectedYearRange,
      this.includeUserRated,
    );
  }

  showSpecials(includeSpecials: boolean): FolgenFilter<T> {
    return new FolgenFilter(
      this.folgen,
      this.searchTerm,
      includeSpecials,
      this.selectedYearRange,
      this.includeUserRated,
    );
  }

  showUserRated(
    this: FolgenFilter<RatedFolge & T>,
    includeUserRated: boolean,
  ): FolgenFilter<T> {
    return new FolgenFilter(
      this.folgen,
      this.searchTerm,
      this.includeSpecials,
      this.selectedYearRange,
      includeUserRated,
    );
  }

  yearRange(yearRange: FolgenYearRange): FolgenFilter<T> {
    return new FolgenFilter(
      this.folgen,
      this.searchTerm,
      this.includeSpecials,
      yearRange,
      this.includeUserRated,
    );
  }
}

export function createFolgenFilter<T extends FilterableFolge>(
  folgen: readonly T[],
): FolgenFilter<T> {
  return new FolgenFilter(folgen);
}

function matchesSearchTerm(folge: FilterableFolge, query: string): boolean {
  return (
    folge.title.toLocaleLowerCase("de-DE").includes(query) ||
    (folge.number?.toString().includes(query) ?? false) ||
    (folge.release_date?.slice(0, 4).includes(query) ?? false)
  );
}
