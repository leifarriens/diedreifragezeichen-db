import * as z from 'zod';

export const Type = z.enum(['regular', 'special']);

export const Image = z.object({
  url: z.string().url(),
  height: z.number(),
  width: z.number(),
});

export const folgeValidator = z.object({
  name: z.string().min(1),
  number: z.string().optional(),
  type: Type,
  images: z.array(Image),
  rating: z.number().min(1).max(10),
  number_of_ratings: z.number().int(),
  popularity: z.number(),
  user_rating: z.number().optional(),
  inhalt: z.string().optional(),
  release_date: z.date(),
  spotify_id: z.string().length(22),
  deezer_id: z.string().optional(),
  isHidden: z.boolean().default(false),
  created_at: z.date(),
  updated_at: z.date(),
});
