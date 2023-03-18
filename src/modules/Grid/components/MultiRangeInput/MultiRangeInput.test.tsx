import { fireEvent, render, waitFor } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import { MultiRangeInput } from './MultiRangeInput';

describe('MultiRangeInput', () => {
  const min = 1;
  const max = 100;
  const onChange = vi.fn();
  const { getByLabelText } = render(
    <MultiRangeInput min={min} max={max} onChange={onChange} />,
  );

  const minSlider = getByLabelText('Slider Minimum') as HTMLInputElement;
  const maxSlider = getByLabelText('Slider Maximum') as HTMLInputElement;

  test('sets min and max value correctly', () => {
    fireEvent.change(minSlider, { target: { value: '20' } });
    fireEvent.change(maxSlider, { target: { value: '70' } });

    expect(minSlider.value).toBe('20');
    expect(maxSlider.value).toBe('70');
  });

  test('min cannot be set higher than max', async () => {
    fireEvent.change(minSlider, { target: { value: '80' } });

    // callback is debounced
    await waitFor(
      () => {
        expect(onChange).toHaveBeenCalledWith({ max: 70, min: 69 });
      },
      { timeout: 200 },
    );
  });

  test('max cannot be set lower than min', async () => {
    fireEvent.change(minSlider, { target: { value: '50' } });
    fireEvent.change(maxSlider, { target: { value: '40' } });

    // callback is debounced
    await waitFor(
      () => {
        expect(onChange).toHaveBeenCalledWith({ max: 51, min: 50 });
      },
      { timeout: 200 },
    );
  });

  test('Slider Minimum cannot be set lower than min prop', async () => {
    fireEvent.change(minSlider, { target: { value: '0' } });
    fireEvent.change(maxSlider, { target: { value: max } });

    // callback is debounced
    await waitFor(
      () => {
        expect(onChange).toHaveBeenCalledWith({ max, min });
      },
      { timeout: 200 },
    );
  });

  test('Slider Maximum cannot be set higher than max prop', async () => {
    fireEvent.change(minSlider, { target: { value: min } });
    fireEvent.change(maxSlider, { target: { value: max + 1 } });

    // callback is debounced
    await waitFor(
      () => {
        expect(onChange).toHaveBeenCalledWith({ max, min });
      },
      { timeout: 200 },
    );
  });
});
