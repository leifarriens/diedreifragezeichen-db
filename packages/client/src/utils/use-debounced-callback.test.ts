// @vitest-environment jsdom

import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useDebouncedCallback } from "./use-debounced-callback";

describe("useDebouncedCallback", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("should debounce callback execution", () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useDebouncedCallback(callback, 500));

    const [debouncedCallback] = result.current;

    act(() => {
      debouncedCallback("a");
      debouncedCallback("b");
      debouncedCallback("c");
    });

    expect(callback).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith("c");
  });

  it("should use default delay of 500ms", () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useDebouncedCallback(callback));

    const [debouncedCallback] = result.current;

    act(() => {
      debouncedCallback();
    });

    act(() => {
      vi.advanceTimersByTime(499);
    });

    expect(callback).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should reset timer on each call", () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useDebouncedCallback(callback, 500));

    const [debouncedCallback] = result.current;

    act(() => {
      debouncedCallback("first");
    });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    act(() => {
      debouncedCallback("second");
    });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(callback).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith("second");
  });

  it("should cancel pending callback", () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useDebouncedCallback(callback, 500));

    const [debouncedCallback, cancel] = result.current;

    act(() => {
      debouncedCallback("test");
    });

    act(() => {
      vi.advanceTimersByTime(250);
    });

    act(() => {
      cancel();
    });

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(callback).not.toHaveBeenCalled();
  });

  it("should pass all arguments to callback", () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useDebouncedCallback(callback, 100));

    const [debouncedCallback] = result.current;

    act(() => {
      debouncedCallback("arg1", "arg2", 123);
    });

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(callback).toHaveBeenCalledWith("arg1", "arg2", 123);
  });

  it("should use latest callback reference", () => {
    const callback1 = vi.fn();
    const callback2 = vi.fn();

    const { rerender, result } = renderHook(
      ({ cb }) => useDebouncedCallback(cb, 500),
      { initialProps: { cb: callback1 } },
    );

    const [debouncedCallback] = result.current;

    act(() => {
      debouncedCallback();
    });

    rerender({ cb: callback2 });

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(callback1).not.toHaveBeenCalled();
    expect(callback2).toHaveBeenCalledTimes(1);
  });

  it("should cleanup on unmount", () => {
    const callback = vi.fn();
    const { result, unmount } = renderHook(() =>
      useDebouncedCallback(callback, 500),
    );

    const [debouncedCallback] = result.current;

    act(() => {
      debouncedCallback();
    });

    unmount();

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(callback).not.toHaveBeenCalled();
  });

  it("should handle delay changes", () => {
    const callback = vi.fn();

    const { rerender, result } = renderHook(
      ({ delay }) => useDebouncedCallback(callback, delay),
      { initialProps: { delay: 500 } },
    );

    act(() => {
      result.current[0]("test");
    });

    rerender({ delay: 100 });

    // Get new debounced callback with updated delay
    act(() => {
      result.current[0]("updated");
    });

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith("updated");
  });
});
