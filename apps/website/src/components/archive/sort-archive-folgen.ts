import type { FolgeWithCommunityRating } from "@/lib/types";

export type ArchiveSortOrder = "newest" | "oldest" | "rating";

type SortableFolge = Pick<
  FolgeWithCommunityRating,
  "communityRating" | "release_date" | "title"
>;

export function sortArchiveFolgen<T extends SortableFolge>(
  folgen: T[],
  sortOrder: ArchiveSortOrder,
): T[] {
  return [...folgen].sort((left, right) => {
    if (sortOrder === "rating") {
      const leftRating = left.communityRating?.score ?? null;
      const rightRating = right.communityRating?.score ?? null;

      if (leftRating === null && rightRating !== null) return 1;
      if (rightRating === null && leftRating !== null) return -1;
      if (
        leftRating !== null &&
        rightRating !== null &&
        leftRating !== rightRating
      ) {
        return rightRating - leftRating;
      }

      return compareReleaseDates(left, right, "newest");
    }

    return compareReleaseDates(left, right, sortOrder);
  });
}

function compareReleaseDates(
  left: Pick<SortableFolge, "release_date" | "title">,
  right: Pick<SortableFolge, "release_date" | "title">,
  order: "newest" | "oldest",
) {
  const leftDate = left.release_date?.slice(0, 10) ?? "";
  const rightDate = right.release_date?.slice(0, 10) ?? "";

  if (leftDate !== rightDate) {
    if (!leftDate) return 1;
    if (!rightDate) return -1;
    return order === "newest"
      ? rightDate.localeCompare(leftDate)
      : leftDate.localeCompare(rightDate);
  }

  return left.title.localeCompare(right.title, "de");
}
