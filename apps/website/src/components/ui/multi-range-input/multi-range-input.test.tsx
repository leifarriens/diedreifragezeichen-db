// @vitest-environment jsdom

import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { RangeChangeEvent } from "./multi-range-input";

import { MultiRangeInput } from "./multi-range-input";

const MIN_YEAR = 1979;
const MAX_YEAR = 2026;

function RangeInput({
  debounceMs,
  onChange,
}: {
  debounceMs?: number | undefined;
  onChange?: (range: RangeChangeEvent) => void;
}) {
  const [value, setValue] = useState({ max: MAX_YEAR, min: MIN_YEAR });
  return (
    <MultiRangeInput
      debounceMs={debounceMs}
      max={MAX_YEAR}
      maxAriaLabel="Spätestes Erscheinungsjahr"
      min={MIN_YEAR}
      minAriaLabel="Frühestes Erscheinungsjahr"
      onChange={(range) => {
        setValue(range);
        onChange?.(range);
      }}
      value={value}
    />
  );
}

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("MultiRangeInput", () => {
  it("starts with the provided minimum and maximum values", () => {
    render(<RangeInput />);
    expect(
      screen.getByRole("slider", { name: "Frühestes Erscheinungsjahr" }),
    ).toHaveProperty("value", "1979");
    expect(
      screen.getByRole("slider", { name: "Spätestes Erscheinungsjahr" }),
    ).toHaveProperty("value", "2026");
  });

  it("keeps both handles within bounds and at least one step apart", () => {
    render(<RangeInput />);
    const minimumSlider = screen.getByRole("slider", {
      name: "Frühestes Erscheinungsjahr",
    });
    const maximumSlider = screen.getByRole("slider", {
      name: "Spätestes Erscheinungsjahr",
    });

    fireEvent.change(minimumSlider, { target: { value: "1900" } });
    fireEvent.change(maximumSlider, { target: { value: "2100" } });
    expect(minimumSlider).toHaveProperty("value", "1979");
    expect(maximumSlider).toHaveProperty("value", "2026");

    fireEvent.change(maximumSlider, { target: { value: "1980" } });
    fireEvent.change(minimumSlider, { target: { value: "2026" } });
    expect(minimumSlider).toHaveProperty("value", "1979");
    expect(maximumSlider).toHaveProperty("value", "1980");
  });

  it("reports changes immediately without a pending update overwriting navigation", () => {
    const onChange = vi.fn();
    render(<RangeInput onChange={onChange} />);
    fireEvent.change(
      screen.getByRole("slider", { name: "Frühestes Erscheinungsjahr" }),
      { target: { value: "2000" } },
    );
    fireEvent.change(
      screen.getByRole("slider", { name: "Spätestes Erscheinungsjahr" }),
      { target: { value: "2020" } },
    );
    expect(onChange).toHaveBeenLastCalledWith({ max: 2020, min: 2000 });
  });

  it("debounces updates while keeping slider values responsive", () => {
    vi.useFakeTimers();
    const onChange = vi.fn();
    render(<RangeInput debounceMs={200} onChange={onChange} />);
    const minimumSlider = screen.getByRole("slider", {
      name: "Frühestes Erscheinungsjahr",
    });
    const maximumSlider = screen.getByRole("slider", {
      name: "Spätestes Erscheinungsjahr",
    });

    fireEvent.change(minimumSlider, { target: { value: "2000" } });
    expect(minimumSlider).toHaveProperty("value", "2000");
    fireEvent.change(maximumSlider, { target: { value: "2020" } });
    expect(maximumSlider).toHaveProperty("value", "2020");

    act(() => {
      vi.advanceTimersByTime(199);
    });
    expect(onChange).not.toHaveBeenCalled();
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(onChange).toHaveBeenCalledOnce();
    expect(onChange).toHaveBeenCalledWith({ max: 2020, min: 2000 });
  });

  it("reflects externally restored values without emitting a change", () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <MultiRangeInput
        max={MAX_YEAR}
        maxAriaLabel="Maximum"
        min={MIN_YEAR}
        minAriaLabel="Minimum"
        onChange={onChange}
        value={{ max: MAX_YEAR, min: MIN_YEAR }}
      />,
    );
    rerender(
      <MultiRangeInput
        max={MAX_YEAR}
        maxAriaLabel="Maximum"
        min={MIN_YEAR}
        minAriaLabel="Minimum"
        onChange={onChange}
        value={{ max: 2020, min: 1990 }}
      />,
    );
    expect(screen.getByRole("slider", { name: "Minimum" })).toHaveProperty(
      "value",
      "1990",
    );
    expect(screen.getByRole("slider", { name: "Maximum" })).toHaveProperty(
      "value",
      "2020",
    );
    expect(onChange).not.toHaveBeenCalled();
  });
});
