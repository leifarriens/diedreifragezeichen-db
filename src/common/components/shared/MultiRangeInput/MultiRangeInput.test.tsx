import { cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, test, vi } from 'vitest';

import { MultiRangeInput } from './MultiRangeInput';

const min = 1;
const max = 100;

const setup = () => {
  const onChange = vi.fn();
  const { getByLabelText } = render(
    <MultiRangeInput min={min} max={max} onChange={onChange} />,
  );

  return {
    minSlider: getByLabelText('Slider Minimum') as HTMLInputElement,
    maxSlider: getByLabelText('Slider Maximum') as HTMLInputElement,
    onChange,
  };
};

describe('MultiRangeInput', () => {
  afterEach(cleanup);

  test('sets min and max value correctly', () => {
    const { minSlider, maxSlider } = setup();

    fireEvent.change(minSlider, { target: { value: '20' } });
    fireEvent.change(maxSlider, { target: { value: '70' } });

    expect(minSlider.value).toBe('20');
    expect(maxSlider.value).toBe('70');
  });

  test('min cannot be set higher than max', async () => {
    const { minSlider, maxSlider, onChange } = setup();

    fireEvent.change(maxSlider, { target: { value: '70' } });
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
    const { minSlider, maxSlider, onChange } = setup();

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
    const { minSlider, onChange } = setup();

    fireEvent.change(minSlider, { target: { value: '50' } });
    fireEvent.change(minSlider, { target: { value: '0' } });

    // callback is debounced
    await waitFor(
      () => {
        expect(onChange).toHaveBeenCalledWith({ max, min });
      },
      { timeout: 200 },
    );
  });

  test('Slider Maximum cannot be set higher than max prop', async () => {
    const { maxSlider, onChange } = setup();

    fireEvent.change(maxSlider, { target: { value: '70' } });
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
