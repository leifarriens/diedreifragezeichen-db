import { describe, expect, test } from 'vitest';

import {
  maskFolgeForPublic,
  MIN_NUMBER_OF_RATINGS,
} from './maskFolgeForPublic';

describe('maskFolgeForPublic', () => {
  test('uses a minimum of three ratings', () => {
    expect(MIN_NUMBER_OF_RATINGS).toBe(3);
  });

  test('masks ratings below the minimum as zero', () => {
    expect(
      maskFolgeForPublic({ rating: 8.5, number_of_ratings: 0 }),
    ).toMatchObject({ rating: 0, number_of_ratings: 0 });
    expect(
      maskFolgeForPublic({
        rating: 8.5,
        number_of_ratings: 2,
      }),
    ).toMatchObject({ rating: 0, number_of_ratings: 2 });
  });

  test('masks invalid ratings even at or above the minimum', () => {
    expect(
      maskFolgeForPublic({
        rating: Number.NaN,
        number_of_ratings: MIN_NUMBER_OF_RATINGS,
      }),
    ).toMatchObject({
      rating: 0,
      number_of_ratings: MIN_NUMBER_OF_RATINGS,
    });
  });

  test('keeps ratings at or above the minimum', () => {
    expect(
      maskFolgeForPublic({
        rating: 8.5,
        number_of_ratings: MIN_NUMBER_OF_RATINGS,
      }),
    ).toMatchObject({
      rating: 8.5,
      number_of_ratings: MIN_NUMBER_OF_RATINGS,
    });
  });
});
