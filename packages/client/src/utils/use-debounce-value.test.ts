// @vitest-environment jsdom

import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useDebouncedValue } from "./use-debounce-value";

describe("useDebounceValue", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("should return initial value immediately", () => {
    const { result } = renderHook(() => useDebouncedValue("initial", 500));
    expect(result.current).toBe("initial");
  });

  it("should preserve function values without invoking them", () => {
    const initialValue = vi.fn();
    const updatedValue = vi.fn();
    const { rerender, result } = renderHook(
      ({ value }) => useDebouncedValue(value, 500),
      { initialProps: { value: initialValue } },
    );

    expect(result.current).toBe(initialValue);
    expect(initialValue).not.toHaveBeenCalled();

    rerender({ value: updatedValue });

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current).toBe(updatedValue);
    expect(updatedValue).not.toHaveBeenCalled();
  });

  it("should debounce value updates", () => {
    const { rerender, result } = renderHook(
      ({ delay, value }) => useDebouncedValue(value, delay),
      { initialProps: { delay: 500, value: "initial" } },
    );

    expect(result.current).toBe("initial");

    rerender({ delay: 500, value: "updated" });
    expect(result.current).toBe("initial");

    act(() => {
      vi.advanceTimersByTime(499);
    });
    expect(result.current).toBe("initial");

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe("updated");
  });

  it("should reset timer on rapid value changes", () => {
    const { rerender, result } = renderHook(
      ({ value }) => useDebouncedValue(value, 500),
      { initialProps: { value: "a" } },
    );

    rerender({ value: "b" });
    act(() => {
      vi.advanceTimersByTime(300);
    });

    rerender({ value: "c" });
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe("a");

    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe("c");
  });

  it("should use default delay of 500ms", () => {
    const { rerender, result } = renderHook(
      ({ value }) => useDebouncedValue(value),
      {
        initialProps: { value: "initial" },
      },
    );

    rerender({ value: "updated" });

    act(() => {
      vi.advanceTimersByTime(499);
    });
    expect(result.current).toBe("initial");

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe("updated");
  });
});
