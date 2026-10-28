// @vitest-environment jsdom

import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ArchiveSearchStateProvider } from "@/features/archive/context/archive-search-state-provider";

import { ArchiveSearch } from "./archive-search";

vi.mock("next/navigation", () => ({ usePathname: () => "/" }));

function renderArchiveSearch() {
  return render(
    <ArchiveSearchStateProvider currentYear={2026}>
      <ArchiveSearch platform="other" />
    </ArchiveSearchStateProvider>,
  );
}

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  window.history.replaceState(null, "", "/");
});

describe("ArchiveSearch", () => {
  it("clears the search immediately on Escape without losing focus or other filters", () => {
    window.history.replaceState(null, "", "/?q=Justus&authors=André+Marx");
    renderArchiveSearch();
    const input = screen.getByRole("textbox");
    expect(input).toHaveProperty("value", "Justus");

    act(() => {
      input.focus();
    });
    fireEvent.keyDown(input, { key: "Escape" });

    expect(input).toHaveProperty("value", "");
    expect(document.activeElement).toBe(input);
    const params = new URLSearchParams(window.location.search);
    expect(params.has("q")).toBe(false);
    expect(params.get("authors")).toBe("André Marx");
  });

  it.each(["Escape", "click"])(
    "cancels pending debounced updates when clearing via %s",
    (method) => {
      vi.useFakeTimers();
      renderArchiveSearch();
      const input = screen.getByRole("textbox");
      act(() => {
        input.focus();
      });
      fireEvent.change(input, { target: { value: "Justus" } });
      expect(input).toHaveProperty("value", "Justus");

      if (method === "Escape") {
        fireEvent.keyDown(input, { key: "Escape" });
      } else {
        fireEvent.click(screen.getByRole("button", { name: "Suche leeren" }));
      }
      expect(input).toHaveProperty("value", "");

      act(() => {
        vi.advanceTimersByTime(200);
      });
      expect(input).toHaveProperty("value", "");
      expect(new URLSearchParams(window.location.search).has("q")).toBe(false);

      fireEvent.change(input, { target: { value: "Peter" } });
      act(() => {
        vi.advanceTimersByTime(200);
      });
      expect(new URLSearchParams(window.location.search).get("q")).toBe(
        "Peter",
      );
    },
  );

  it("does not clear the search when Escape is pressed outside the input", () => {
    window.history.replaceState(null, "", "/?q=Justus");
    renderArchiveSearch();

    fireEvent.keyDown(window, { key: "Escape" });

    expect(screen.getByRole("textbox")).toHaveProperty("value", "Justus");
  });

  it("does not clear the search when Escape cancels IME composition", () => {
    window.history.replaceState(null, "", "/?q=Justus");
    renderArchiveSearch();
    const input = screen.getByRole("textbox");
    act(() => {
      input.focus();
    });

    fireEvent.keyDown(input, { isComposing: true, key: "Escape" });

    expect(input).toHaveProperty("value", "Justus");
  });

  it("clears the committed search and focuses the input when clicking the X", () => {
    window.history.replaceState(null, "", "/?q=Justus&authors=André+Marx");
    renderArchiveSearch();
    const input = screen.getByRole("textbox");
    const clearButton = screen.getByRole("button", { name: "Suche leeren" });
    act(() => {
      clearButton.focus();
    });

    fireEvent.click(clearButton);

    expect(input).toHaveProperty("value", "");
    expect(document.activeElement).toBe(input);
    const params = new URLSearchParams(window.location.search);
    expect(params.has("q")).toBe(false);
    expect(params.get("authors")).toBe("André Marx");
  });

  it("renders the clear button only when the input contains text", () => {
    renderArchiveSearch();
    const input = screen.getByRole("textbox");
    act(() => {
      input.focus();
    });
    expect(screen.queryByRole("button", { name: "Suche leeren" })).toBeNull();

    fireEvent.change(input, { target: { value: "Justus" } });
    const focusHint = screen.getByText("Strg").parentElement;
    const clearButton = screen.getByRole("button", { name: "Suche leeren" });

    expect(focusHint?.className).toContain("group-focus-within:hidden");
    expect(clearButton.className).toContain("group-focus-within:flex");
    expect(clearButton.className).not.toContain("any-pointer-coarse:hidden");
    expect(screen.queryByText("esc")).toBeNull();

    fireEvent.change(input, { target: { value: "" } });
    expect(screen.queryByRole("button", { name: "Suche leeren" })).toBeNull();
  });
});
