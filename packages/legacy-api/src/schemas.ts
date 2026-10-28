import * as z from "zod";

export const allFolgenQuerySchema = z
  .object({
    apikey: z.string().optional(),
    limit: z.coerce.number().int().min(1).max(50).default(50),
    offset: z.coerce.number().int().min(0).default(0),
    query: z.string().max(255).optional(),
    sort: z
      .enum(["release_date", "-release_date", "rating", "-rating"])
      .default("-release_date"),
  })
  .strict();

export const mongoObjectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId");
