import { index, pgTable, primaryKey, text } from "drizzle-orm/pg-core";

import { user } from "./auth";
import { createdAt, folgeId } from "./shared";

export const bookmark = pgTable(
  "bookmark",
  {
    createdAt,
    folgeId,
    userId: text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({
      columns: [table.userId, table.folgeId],
      name: "bookmark_user_id_folge_id_pk",
    }),
    index("bookmark_user_created_at_idx").on(table.userId, table.createdAt),
  ],
);
