import "server-only";
import type { BookmarkRepository } from "@ddfdb/user-api";

import { db, schema } from "@ddfdb/db";
import { and, desc, eq } from "drizzle-orm";

import { toBookmarkResponse } from "./bookmark.mapper";

const bookmarkResponseSelection = {
  createdAt: schema.bookmark.createdAt,
  folgeId: schema.bookmark.folgeId,
};

export const bookmarkRepository: BookmarkRepository = {
  async createBookmark({ folgeId, userId }) {
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

  async deleteBookmark({ folgeId, userId }) {
    await db
      .delete(schema.bookmark)
      .where(
        and(
          eq(schema.bookmark.userId, userId),
          eq(schema.bookmark.folgeId, folgeId),
        ),
      );
  },

  /**
   * Finds all bookmarks made by a specific user, ordered by the most recent creation date.
   */
  async findBookmarksByUserId({ userId }) {
    const bookmarks = await db
      .select(bookmarkResponseSelection)
      .from(schema.bookmark)
      .where(eq(schema.bookmark.userId, userId))
      .orderBy(desc(schema.bookmark.createdAt));

    return bookmarks.map(toBookmarkResponse);
  },
};
