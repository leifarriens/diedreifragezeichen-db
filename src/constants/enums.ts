import { z } from 'zod';

export const allFolgenSortOptions = [
  'release_date',
  'rating',
  'updated_at',
] as const;

export const AllFolgenSortOptions = z
  .enum(allFolgenSortOptions)
  .default('release_date');

export type AllFolgenSortOptions = z.infer<typeof AllFolgenSortOptions>;

export const ratingsSortOptions = ['updated_at', 'value'] as const;

export const RatingsSortOptions = z
  .enum(ratingsSortOptions)
  .default('updated_at');

export type RatingsSortOptions = z.infer<typeof RatingsSortOptions>;

export enum RatingsSortOptionsNames {
  'updated_at' = 'Zuletzt hinzugefügt',
  'value' = 'Deine Bewertung',
}
