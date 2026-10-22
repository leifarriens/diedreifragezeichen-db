export type AnySortOption =
  | CommunityRatingSortOption
  | PopularitySortOption
  | ReleaseDateSortOption
  | UserDataSortOption;

export interface BookmarkDateSortOption {
  by: "bookmarkedAt";
  order: "newest" | "oldest";
}

export interface CommunityRatingSortOption {
  by: "communityRating";
  order: "highest" | "lowest";
}

export interface ListenedDateSortOption {
  by: "listenedAt";
  order: "newest" | "oldest";
}

export interface PopularitySortOption {
  by: "popularity";
  order: "highest" | "lowest";
}

export interface ReleaseDateSortOption {
  by: "releaseDate";
  order: "newest" | "oldest";
}

export interface SortableFolge {
  id: number;
  release_date: null | string;
  title: string;
}

export type UserDataSortOption =
  | BookmarkDateSortOption
  | ListenedDateSortOption
  | UserRatingSortOption
  | UserRatingUpdatedSortOption;

export interface UserRatingSortOption {
  by: "userRating";
  order: "highest" | "lowest";
}

export interface UserRatingUpdatedSortOption {
  by: "userRatingUpdatedAt";
  order: "newest" | "oldest";
}

interface BookmarkedFolge {
  bookmarkedAt: null | string;
}

interface CommunityRatedFolge {
  communityRating: null | { score: number };
}

interface ListenedFolge {
  listenedAt: null | string;
}

interface PopularityScoredFolge {
  communityRating: null | { popularity: number };
}

interface UserRatedFolge {
  userRating: null | number;
}

interface UserRatingUpdatedFolge {
  userRatingUpdatedAt: null | string;
}

export function sortFolgen<T extends SortableFolge>(
  folgen: readonly T[],
  sort: ReleaseDateSortOption,
): T[];
export function sortFolgen<T extends BookmarkedFolge & SortableFolge>(
  folgen: readonly T[],
  sort: BookmarkDateSortOption,
): T[];
export function sortFolgen<T extends ListenedFolge & SortableFolge>(
  folgen: readonly T[],
  sort: ListenedDateSortOption,
): T[];
export function sortFolgen<T extends CommunityRatedFolge & SortableFolge>(
  folgen: readonly T[],
  sort: CommunityRatingSortOption,
): T[];
export function sortFolgen<T extends PopularityScoredFolge & SortableFolge>(
  folgen: readonly T[],
  sort: PopularitySortOption,
): T[];
export function sortFolgen<T extends SortableFolge & UserRatingUpdatedFolge>(
  folgen: readonly T[],
  sort: UserRatingUpdatedSortOption,
): T[];
export function sortFolgen<
  T extends SortableFolge & UserRatedFolge & UserRatingUpdatedFolge,
>(
  folgen: readonly T[],
  sort: UserRatingSortOption | UserRatingUpdatedSortOption,
): T[];
export function sortFolgen<
  T extends BookmarkedFolge &
    ListenedFolge &
    SortableFolge &
    UserRatedFolge &
    UserRatingUpdatedFolge,
>(folgen: readonly T[], sort: UserDataSortOption): T[];
export function sortFolgen<T extends SortableFolge & UserRatedFolge>(
  folgen: readonly T[],
  sort: UserRatingSortOption,
): T[];
export function sortFolgen<T extends SortableFolge>(
  folgen: readonly T[],
  sort: AnySortOption,
): T[] {
  return [...folgen].sort((left, right) => compareFolgen(left, right, sort));
}

function compareByTitleAndId(
  left: SortableFolge,
  right: SortableFolge,
): number {
  return left.title.localeCompare(right.title, "de") || left.id - right.id;
}

function compareFolgen(
  left: SortableFolge,
  right: SortableFolge,
  sort: AnySortOption,
): number {
  switch (sort.by) {
    case "bookmarkedAt": {
      const comparison = compareNullableStrings(
        getBookmarkedAt(left),
        getBookmarkedAt(right),
        sort.order,
      );

      return comparison || compareByTitleAndId(left, right);
    }
    case "communityRating": {
      const comparison = compareNullableNumbers(
        getCommunityRating(left),
        getCommunityRating(right),
        sort.order,
      );

      if (comparison !== 0) return comparison;

      return compareReleaseDates(left, right, "newest");
    }
    case "listenedAt": {
      const comparison = compareNullableStrings(
        getListenedAt(left),
        getListenedAt(right),
        sort.order,
      );

      return comparison || compareByTitleAndId(left, right);
    }
    case "popularity": {
      const comparison = compareNullableNumbers(
        getPopularity(left),
        getPopularity(right),
        sort.order,
      );

      if (comparison !== 0) return comparison;

      return compareReleaseDates(left, right, "newest");
    }
    case "releaseDate":
      return compareReleaseDates(left, right, sort.order);
    case "userRating": {
      const comparison = compareNullableNumbers(
        getUserRating(left),
        getUserRating(right),
        sort.order,
      );

      return comparison || compareUserRatingTies(left, right);
    }
    case "userRatingUpdatedAt": {
      const comparison = compareNullableStrings(
        getUserRatingUpdatedAt(left),
        getUserRatingUpdatedAt(right),
        sort.order,
      );
      const ratingComparison = compareNullableNumbers(
        getUserRating(left),
        getUserRating(right),
        "highest",
      );

      return comparison || ratingComparison || compareByTitleAndId(left, right);
    }
  }
}

function compareNullableNumbers(
  left: null | number,
  right: null | number,
  order: "highest" | "lowest",
): number {
  if (left === null && right !== null) return 1;
  if (right === null && left !== null) return -1;
  if (left === null || right === null || left === right) return 0;

  return order === "highest" ? right - left : left - right;
}

function compareNullableStrings(
  left: null | string,
  right: null | string,
  order: "newest" | "oldest",
): number {
  if (left === null && right !== null) return 1;
  if (right === null && left !== null) return -1;
  if (left === null || right === null || left === right) return 0;

  return order === "newest"
    ? right.localeCompare(left)
    : left.localeCompare(right);
}

function compareReleaseDates(
  left: SortableFolge,
  right: SortableFolge,
  order: "newest" | "oldest",
): number {
  const leftDate = left.release_date?.slice(0, 10) ?? "";
  const rightDate = right.release_date?.slice(0, 10) ?? "";

  if (leftDate !== rightDate) {
    if (!leftDate) return 1;
    if (!rightDate) return -1;

    return order === "newest"
      ? rightDate.localeCompare(leftDate)
      : leftDate.localeCompare(rightDate);
  }

  return compareByTitleAndId(left, right);
}

function compareUserRatingTies(
  left: SortableFolge,
  right: SortableFolge,
): number {
  const updatedAtComparison = compareNullableStrings(
    getUserRatingUpdatedAt(left),
    getUserRatingUpdatedAt(right),
    "newest",
  );

  return updatedAtComparison || compareByTitleAndId(left, right);
}

function getBookmarkedAt(folge: SortableFolge): null | string {
  if (!("bookmarkedAt" in folge) || typeof folge.bookmarkedAt !== "string") {
    return null;
  }

  return folge.bookmarkedAt;
}

function getCommunityRating(folge: SortableFolge): null | number {
  if (!("communityRating" in folge)) return null;

  const communityRating = folge.communityRating;
  if (
    communityRating === null ||
    typeof communityRating !== "object" ||
    !("score" in communityRating) ||
    typeof communityRating.score !== "number"
  ) {
    return null;
  }

  return communityRating.score;
}

function getListenedAt(folge: SortableFolge): null | string {
  if (!("listenedAt" in folge) || typeof folge.listenedAt !== "string") {
    return null;
  }

  return folge.listenedAt;
}

function getPopularity(folge: SortableFolge): null | number {
  if (!("communityRating" in folge) || !isRecord(folge.communityRating)) {
    return null;
  }

  return typeof folge.communityRating.popularity === "number"
    ? folge.communityRating.popularity
    : null;
}

function getUserRating(folge: SortableFolge): null | number {
  if (!("userRating" in folge) || typeof folge.userRating !== "number") {
    return null;
  }

  return folge.userRating;
}

function getUserRatingUpdatedAt(folge: SortableFolge): null | string {
  if (
    !("userRatingUpdatedAt" in folge) ||
    typeof folge.userRatingUpdatedAt !== "string"
  ) {
    return null;
  }

  return folge.userRatingUpdatedAt;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
