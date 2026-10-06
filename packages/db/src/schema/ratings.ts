import { sql } from "drizzle-orm";
import {
  check,
  index,
  pgTable,
  primaryKey,
  smallint,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

import { folgeId } from "./archiv";
import { user } from "./auth";

export const rating = pgTable(
  "rating",
  {
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    folgeId,
    score: smallint().notNull(),
    updatedAt: timestamp({ withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
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
    check("rating_score_range_check", sql`${table.score} between 1 and 10`),
  ],
);
