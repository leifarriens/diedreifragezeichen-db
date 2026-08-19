import type { FolgeWithId } from '@/models/folge';

export const MIN_NUMBER_OF_RATINGS = 3;

export function maskFolgeForPublic<
  T extends Pick<FolgeWithId, 'rating' | 'number_of_ratings'>,
>(folge: T): T {
  return {
    ...folge,
    rating: folge.number_of_ratings >= MIN_NUMBER_OF_RATINGS ? folge.rating : 0,
  };
}
