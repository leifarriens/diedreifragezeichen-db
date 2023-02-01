import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, test } from 'vitest';

import RatingInput from './RatingInput';

afterEach(() => {
  cleanup();
});

describe('RatingInput', () => {
  test('displays default value', () => {
    const { getByLabelText } = render(<RatingInput defaultValue={8} />);

    const slider = getByLabelText('Rating Slider') as HTMLInputElement;

    expect(slider.value).toBe('8');
  });

  test('min value >= 0.5', () => {
    const { getByLabelText } = render(<RatingInput defaultValue={-1} />);

    const slider = getByLabelText('Rating Slider') as HTMLInputElement;

    expect(slider.value).toBe('0.5');
  });

  test('max value <= 10', () => {
    const { getByLabelText } = render(<RatingInput defaultValue={11} />);

    const slider = getByLabelText('Rating Slider') as HTMLInputElement;

    expect(slider.value).toBe('10');
  });
});
