import * as z from "zod";

export const allFolgenQuerySchema = z.object({
  // apikey: z.uuid("Malformed apikey"),
  limit: z.coerce.number().min(1).max(20).default(20),
  offset: z.coerce.number().min(0).default(0),
  query: z.string().optional(),
  sort: z
    .enum(["release_date", "-release_date", "rating", "-rating"])
    .default("-release_date"),
});
