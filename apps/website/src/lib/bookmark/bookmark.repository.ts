import type { BookmarkRepository } from "@ddfdb/user-api";

import { db, schema } from "@ddfdb/db";
import { and, eq } from "drizzle-orm";

import { toBookmarkResponse } from "./bookmark.mapper";

const bookmarkResponseSelection = {
  createdAt: schema.bookmark.createdAt,
  folgeId: schema.bookmark.folgeId,
};

export const bookmarkRepository: BookmarkRepository = {
  async addBookmark({ folgeId, userId }) {
    const [bookmark] = await db
      .insert(schema.bookmark)
      .values({
        folgeId,
        userId,
      })
      .onConflictDoNothing({
        target: [schema.bookmark.userId, schema.bookmark.folgeId],
      })
      .returning(bookmarkResponseSelection);

    if (!bookmark) {
      throw new Error("Failed to save bookmark");
    }

    return toBookmarkResponse(bookmark);
  },

  async getUserBookmarks({ userId }) {
    const bookmarks = await db
      .select(bookmarkResponseSelection)
      .from(schema.bookmark)
      .where(eq(schema.bookmark.userId, userId));

    return bookmarks.map(toBookmarkResponse);
  },

  async removeBookmark({ folgeId, userId }) {
    await db
      .delete(schema.bookmark)
      .where(
        and(
          eq(schema.bookmark.userId, userId),
          eq(schema.bookmark.folgeId, folgeId),
        ),
      );
  },
};
