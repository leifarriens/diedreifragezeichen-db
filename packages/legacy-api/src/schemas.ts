import * as z from "zod";

export const allFolgenQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).default(50),
  offset: z.coerce.number().int().min(0).default(0),
  query: z.string().optional(),
  sort: z
    .enum(["release_date", "-release_date", "rating", "-rating"])
    .default("-release_date"),
});

export const mongoObjectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId");
