// @vitest-environment jsdom

import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  ArchiveSearchStateProvider,
  useArchiveSearchState,
} from "./archive-search-state-provider";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

afterEach(() => {
  vi.useRealTimers();
});

describe("ArchiveSearchStateProvider", () => {
  it("refreshes the archive year at runtime", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-15T12:00:00Z"));

    render(
      <ArchiveSearchStateProvider currentYear={2025}>
        <CurrentYear />
      </ArchiveSearchStateProvider>,
    );

    expect(screen.getByText("year 2026; max 2026")).toBeTruthy();

    vi.setSystemTime(new Date("2027-06-15T12:00:00Z"));
    act(() => {
      window.dispatchEvent(new Event("focus"));
    });

    expect(screen.getByText("year 2027; max 2027")).toBeTruthy();
  });
});

function CurrentYear() {
  const { currentYear, state } = useArchiveSearchState();

  return (
    <span>
      year {currentYear.toString()}; max {state.yearRange.max.toString()}
    </span>
  );
}
