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
  it("opens the search dialog on Strg+K on Windows", async () => {
    vi.spyOn(window.navigator, "platform", "get").mockReturnValue("Win32");
    renderSearchInput();

    expect(
      await screen.findByRole(
        "button",
        { name: "Folgen Archiv durchsuchen" },
        { timeout: 5000 },
      ),
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

    expect(await screen.findByRole("dialog")).toBeTruthy();
    expect(await screen.findByText("Strg")).toBeTruthy();
    expect(event.defaultPrevented).toBe(true);
  });

  it("opens the search dialog on Command+K on macOS", async () => {
    vi.spyOn(window.navigator, "platform", "get").mockReturnValue("MacIntel");
    renderSearchInput();

    expect(
      await screen.findByRole(
        "button",
        { name: "Folgen Archiv durchsuchen" },
        { timeout: 5000 },
      ),
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

    expect(await screen.findByRole("dialog")).toBeTruthy();
    expect(await screen.findByText("⌘")).toBeTruthy();
    expect(event.defaultPrevented).toBe(true);
  });

  it("hides the shortcut hint when any pointer is coarse", async () => {
    renderSearchInput();

    const shortcutHint = (
      await screen.findByText("Strg", {}, { timeout: 5000 })
    ).parentElement;

    expect(shortcutHint?.className).toContain("any-pointer-coarse:hidden");
  });
});
