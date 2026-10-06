import { sql } from "drizzle-orm";
import {
  check,
  index,
  pgTable,
  primaryKey,
  smallint,
  text,
} from "drizzle-orm/pg-core";

import { user } from "./auth";
import { createdAt, folgeId, updatedAt } from "./shared";

export const rating = pgTable(
  "rating",
  {
    createdAt,
    folgeId,
    score: smallint().notNull(),
    updatedAt,
    userId: text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({
      columns: [table.userId, table.folgeId],
      name: "rating_user_id_folge_id_pk",
    }),
    index("rating_folge_id_idx").on(table.folgeId),
    check("rating_score_range_check", sql`${table.score} between 1 and 6`),
  ],
);
