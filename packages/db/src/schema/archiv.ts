import { integer } from "drizzle-orm/pg-core";

/**
 * This references Archiv's ID. Archiv is a separate database, so no FK applies.
 */
export const folgeId = integer().notNull();
