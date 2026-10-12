// @vitest-environment jsdom

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ArchiveFiltersProvider } from "@/features/archive/components/archive-filters-provider";

import { SearchInput } from "./search-input";

const route = vi.hoisted(() => ({ pathname: "/folge/1" }));
vi.mock("next/navigation", () => ({ usePathname: () => route.pathname }));

function renderSearchInput() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <ArchiveFiltersProvider currentYear={2026}>
        <SearchInput />
      </ArchiveFiltersProvider>
    </QueryClientProvider>,
  );
}

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("SearchInput keyboard shortcut", () => {
  it("focuses the search input on Alt+K", () => {
    renderSearchInput();

    const input = screen.getByRole("combobox", {
      name: "Folgen Archiv durchsuchen",
    });
    const event = new KeyboardEvent("keydown", {
      altKey: true,
      bubbles: true,
      cancelable: true,
      key: "k",
    });

    act(() => {
      window.dispatchEvent(event);
    });

    expect(document.activeElement).toBe(input);
    expect(event.defaultPrevented).toBe(true);
  });
});
