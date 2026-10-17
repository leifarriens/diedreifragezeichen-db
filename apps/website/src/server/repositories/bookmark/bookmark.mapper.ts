import type { schema } from "@ddfdb/db";
import type { Bookmark } from "@ddfdb/user-api";

type BookmarkSelectRow = Pick<
  typeof schema.bookmark.$inferSelect,
  "createdAt" | "folgeId"
>;

export function toBookmarkResponse({
  createdAt,
  folgeId,
}: BookmarkSelectRow): Bookmark {
  return {
    createdAt: createdAt.toISOString(),
    folgeId,
  };
}
