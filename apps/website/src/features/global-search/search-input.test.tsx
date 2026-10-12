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
  it("focuses the search input on Ctrl+K on Windows", () => {
    vi.spyOn(window.navigator, "platform", "get").mockReturnValue("Win32");
    renderSearchInput();

    const input = screen.getByRole("combobox", {
      name: "Folgen Archiv durchsuchen",
    });
    const event = new KeyboardEvent("keydown", {
      bubbles: true,
      cancelable: true,
      code: "KeyK",
      ctrlKey: true,
      key: "k",
    });

    act(() => {
      window.dispatchEvent(event);
    });

    expect(screen.getByText("Ctrl")).toBeTruthy();
    expect(document.activeElement).toBe(input);
    expect(event.defaultPrevented).toBe(true);
  });

  it("focuses the search input on Command+K on macOS", () => {
    vi.spyOn(window.navigator, "platform", "get").mockReturnValue("MacIntel");
    renderSearchInput();

    const input = screen.getByRole("combobox", {
      name: "Folgen Archiv durchsuchen",
    });
    const event = new KeyboardEvent("keydown", {
      bubbles: true,
      cancelable: true,
      code: "KeyK",
      key: "k",
      metaKey: true,
    });

    act(() => {
      window.dispatchEvent(event);
    });

    expect(screen.getByText("⌘")).toBeTruthy();
    expect(document.activeElement).toBe(input);
    expect(event.defaultPrevented).toBe(true);
  });

  it("hides the shortcut hint when any pointer is coarse", () => {
    renderSearchInput();

    const shortcutHint = screen.getByText("Ctrl").parentElement;

    expect(shortcutHint?.className).toContain("any-pointer-coarse:hidden");
  });
});
