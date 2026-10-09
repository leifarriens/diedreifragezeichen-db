import type { ListenedRepository } from "@ddfdb/user-api";

import { db, schema } from "@ddfdb/db";
import { and, eq } from "drizzle-orm";

import { toListenedResponse } from "./listened.mapper";

const listenedResponseSelection = {
  createdAt: schema.listened.createdAt,
  folgeId: schema.listened.folgeId,
};

export const listenedRepository: ListenedRepository = {
  async addListened({ folgeId, userId }) {
    const [listened] = await db
      .insert(schema.listened)
      .values({
        folgeId,
        userId,
      })
      .onConflictDoNothing({
        target: [schema.listened.userId, schema.listened.folgeId],
      })
      .returning(listenedResponseSelection);

    if (!listened) {
      throw new Error("Failed to mark Folge as listened");
    }

    return toListenedResponse(listened);
  },

  async getUserListened({ userId }) {
    const listened = await db
      .select(listenedResponseSelection)
      .from(schema.listened)
      .where(eq(schema.listened.userId, userId));

    return listened.map(toListenedResponse);
  },

  async removeListened({ folgeId, userId }) {
    await db
      .delete(schema.listened)
      .where(
        and(
          eq(schema.listened.userId, userId),
          eq(schema.listened.folgeId, folgeId),
        ),
      );
  },
};
