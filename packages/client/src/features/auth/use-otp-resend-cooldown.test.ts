// @vitest-environment jsdom

import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useOtpResendCooldown } from "./use-otp-resend-cooldown";

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("useOtpResendCooldown", () => {
  it("counts down from 60 seconds", () => {
    const sentAt = Date.now();
    const { result } = renderHook(() => useOtpResendCooldown(sentAt));

    expect(result.current).toBe(60);
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current).toBe(59);
  });

  it("expires and restarts after another successful send", () => {
    const { rerender, result } = renderHook(
      ({ sentAt }) => useOtpResendCooldown(sentAt),
      { initialProps: { sentAt: Date.now() } },
    );

    act(() => {
      vi.advanceTimersByTime(60_000);
    });
    expect(result.current).toBe(0);
    expect(vi.getTimerCount()).toBe(0);

    rerender({ sentAt: Date.now() });
    expect(result.current).toBe(60);
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current).toBe(59);
  });

  it("uses elapsed time when timers are delayed in the background", () => {
    const sentAt = Date.now();
    const { result } = renderHook(() => useOtpResendCooldown(sentAt));

    act(() => {
      vi.setSystemTime(sentAt + 120_000);
      vi.advanceTimersByTime(1000);
    });

    expect(result.current).toBe(0);
  });

  it("cleans up the timer on unmount", () => {
    const { unmount } = renderHook(() => useOtpResendCooldown(Date.now()));
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
