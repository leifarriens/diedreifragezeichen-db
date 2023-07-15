import { z } from 'zod';

export const AllFolgenSortOptions = z
  .enum(['release_date', 'rating', 'updated_at'])
  .default('release_date');
