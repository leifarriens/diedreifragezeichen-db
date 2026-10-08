import type { Folge } from "@ddfdb/archiv/contracts";

export type AnySortOption =
  | BookmarkDateSortOption
  | CommunityRatingSortOption
  | ReleaseDateSortOption
  | UserRatingSortOption
  | UserRatingUpdatedSortOption;

export interface BookmarkDateSortOption {
  by: "bookmarkedAt";
  order: "newest" | "oldest";
}

export interface CommunityRatingSortOption {
  by: "communityRating";
  order: "highest" | "lowest";
}

export interface ReleaseDateSortOption {
  by: "releaseDate";
  order: "newest" | "oldest";
}

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

type SortableFolge = Pick<Folge, "id" | "release_date" | "title">;

interface UserRatedFolge {
  userRating: null | number;
}

interface UserRatingUpdatedFolge {
  userRatingUpdatedAt: null | string;
}

export function sortFolgen<T extends SortableFolge>(
  folgen: T[],
  sort: ReleaseDateSortOption,
): T[];
export function sortFolgen<T extends BookmarkedFolge & SortableFolge>(
  folgen: T[],
  sort: BookmarkDateSortOption,
): T[];
export function sortFolgen<T extends CommunityRatedFolge & SortableFolge>(
  folgen: T[],
  sort: CommunityRatingSortOption,
): T[];
export function sortFolgen<T extends SortableFolge & UserRatingUpdatedFolge>(
  folgen: T[],
  sort: UserRatingUpdatedSortOption,
): T[];
export function sortFolgen<
  T extends SortableFolge & UserRatedFolge & UserRatingUpdatedFolge,
>(folgen: T[], sort: UserRatingSortOption | UserRatingUpdatedSortOption): T[];
export function sortFolgen<T extends SortableFolge & UserRatedFolge>(
  folgen: T[],
  sort: UserRatingSortOption,
): T[];
export function sortFolgen<T extends SortableFolge>(
  folgen: T[],
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
