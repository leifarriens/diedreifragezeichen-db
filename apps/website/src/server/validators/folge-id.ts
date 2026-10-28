import { z } from "zod";

export const numericFolgeIdSchema = z
  .string()
  .regex(/^\d+$/)
  .refine((id) => id.trim() === id)
  .transform(Number)
  .refine((id) => Number.isSafeInteger(id) && id > 0);
