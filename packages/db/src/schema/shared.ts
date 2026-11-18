import { integer, timestamp } from "drizzle-orm/pg-core";

/**
 * This references Archiv's ID. Archiv is a separate database, so no FK applies.
 */
export const folgeId = integer().notNull();

export const createdAt = timestamp({ withTimezone: true })
  .defaultNow()
  .notNull();

export const updatedAt = timestamp({ withTimezone: true })
  .defaultNow()
  .$onUpdate(() => new Date())
  .notNull();
