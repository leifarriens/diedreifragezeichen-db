import type { FolgeWithUserRating } from "@/lib/types";

export type UserRatedFolgenSortOrder = "best" | "recent" | "worst";

type SortableFolge = Pick<
  FolgeWithUserRating,
  "id" | "title" | "userRating" | "userRatingUpdatedAt"
>;

export function sortUserRatedFolgen<T extends SortableFolge>(
  folgen: T[],
  sortOrder: UserRatedFolgenSortOrder,
): T[] {
  return [...folgen].sort((left, right) => {
    const ratingDifference = (left.userRating ?? 0) - (right.userRating ?? 0);
    const ratingDateDifference = (
      right.userRatingUpdatedAt ?? ""
    ).localeCompare(left.userRatingUpdatedAt ?? "");

    if (sortOrder === "worst" && ratingDifference !== 0) {
      return ratingDifference;
    }

    if (sortOrder === "best" && ratingDifference !== 0) {
      return -ratingDifference;
    }

    if (sortOrder === "recent" && ratingDateDifference !== 0) {
      return ratingDateDifference;
    }

    if (ratingDateDifference !== 0) {
      return ratingDateDifference;
    }

    if (ratingDifference !== 0) {
      return -ratingDifference;
    }

    return left.title.localeCompare(right.title, "de") || left.id - right.id;
  });
}
