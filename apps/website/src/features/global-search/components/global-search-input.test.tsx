// @vitest-environment jsdom

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ArchiveSearchStateProvider } from "@/features/archive/context/archive-search-state-provider";

import { GlobalSearchInput } from "./global-search-input";

const route = vi.hoisted(() => ({ pathname: "/folge/1" }));
vi.mock("next/navigation", () => ({ usePathname: () => route.pathname }));

function renderSearchInput() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <ArchiveSearchStateProvider currentYear={2026}>
        <GlobalSearchInput />
      </ArchiveSearchStateProvider>
    </QueryClientProvider>,
  );
}

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("SearchInput keyboard shortcut", () => {
  it("opens the search dialog on Strg+K on Windows", () => {
    vi.spyOn(window.navigator, "platform", "get").mockReturnValue("Win32");
    renderSearchInput();

    expect(
      screen.getByRole("button", { name: "Folgen Archiv durchsuchen" }),
    ).toBeTruthy();
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

    expect(screen.getByRole("dialog")).toBeTruthy();
    expect(screen.getByText("Strg")).toBeTruthy();
    expect(event.defaultPrevented).toBe(true);
  });

  it("opens the search dialog on Command+K on macOS", () => {
    vi.spyOn(window.navigator, "platform", "get").mockReturnValue("MacIntel");
    renderSearchInput();

    expect(
      screen.getByRole("button", { name: "Folgen Archiv durchsuchen" }),
    ).toBeTruthy();
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

    expect(screen.getByRole("dialog")).toBeTruthy();
    expect(screen.getByText("⌘")).toBeTruthy();
    expect(event.defaultPrevented).toBe(true);
  });

  it("hides the shortcut hint when any pointer is coarse", () => {
    renderSearchInput();

    const shortcutHint = screen.getByText("Strg").parentElement;

    expect(shortcutHint?.className).toContain("any-pointer-coarse:hidden");
  });
});
