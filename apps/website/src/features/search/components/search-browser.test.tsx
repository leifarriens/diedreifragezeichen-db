// @vitest-environment jsdom

import type { SearchOptions } from "@ddfdb/archiv/contracts";

import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";

import { SearchBrowser } from "./search-browser";

const route = vi.hoisted(() => ({ pathname: "/search", search: "" }));

vi.mock("next/navigation", () => ({
  usePathname: () => route.pathname,
  useSearchParams: () => new URLSearchParams(route.search),
}));
vi.mock("@ddfdb/client", () => ({
  useSearch: () => ({ data: undefined }),
}));
vi.mock("@/features/folgen/folgen-grid/folgen-grid", () => ({
  FolgenGrid: () => null,
}));
vi.mock("@/features/folgen/use-hydrate-folgen-with-user-data", () => ({
  useHydrateFolgenWithUserData: (folgen: unknown[]) => folgen,
}));

const availableOptions: SearchOptions = {
  authors: [],
  collections: [],
  roles: [],
  script_authors: [],
  speakers: [],
};

function renderSearch() {
  return render(
    <SearchBrowser availableOptions={availableOptions} folgen={[]} />,
  );
}

function setRoute(url: string) {
  window.history.replaceState(null, "", url);
  route.pathname = window.location.pathname;
  route.search = window.location.search.slice(1);
}

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
  setRoute("/search");
});

describe("SearchBrowser URL state", () => {
  it("server-renders defaults rather than reading the request query", () => {
    setRoute("/search?q=Hugenay");
    const html = renderToString(
      <SearchBrowser availableOptions={availableOptions} folgen={[]} />,
    );

    expect(html).toContain('value=""');
    expect(html).not.toContain('value="Hugenay"');
  });

  it("restores a direct URL into the search controls", () => {
    setRoute("/search?q=Hugenay%20Moriarty&sort=rating&yearFrom=1990");
    const replace = vi.spyOn(window.history, "replaceState");
    renderSearch();

    expect(screen.getByRole("textbox")).toHaveProperty(
      "value",
      "Hugenay Moriarty",
    );
    expect(replace).not.toHaveBeenCalled();
    expect(
      screen.getByRole("slider", { name: "Frühestes Erscheinungsjahr" }),
    ).toHaveProperty("value", "1990");
    expect(
      screen.getByRole("combobox", { name: "Sortieren nach" }).textContent,
    ).toContain("Beste zuerst");
  });

  it("persists a year range as soon as the control's 200 ms debounce settles", () => {
    vi.useFakeTimers();
    setRoute("/search");
    renderSearch();

    fireEvent.change(
      screen.getByRole("slider", { name: "Frühestes Erscheinungsjahr" }),
      { target: { value: "1990" } },
    );
    expect(new URLSearchParams(window.location.search).has("yearFrom")).toBe(
      false,
    );

    act(() => {
      vi.advanceTimersByTime(199);
    });
    expect(new URLSearchParams(window.location.search).has("yearFrom")).toBe(
      false,
    );
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(new URLSearchParams(window.location.search).get("yearFrom")).toBe(
      "1990",
    );
  });

  it("restores client-side query navigation and discards a pending slider draft", () => {
    vi.useFakeTimers();
    setRoute("/search?yearFrom=1990");
    const view = renderSearch();
    const minSlider = screen.getByRole("slider", {
      name: "Frühestes Erscheinungsjahr",
    });

    fireEvent.change(minSlider, { target: { value: "2000" } });
    expect(minSlider).toHaveProperty("value", "2000");
    expect(new URLSearchParams(window.location.search).get("yearFrom")).toBe(
      "1990",
    );

    setRoute("/search?q=external&yearFrom=1990");
    view.rerender(
      <SearchBrowser availableOptions={availableOptions} folgen={[]} />,
    );

    expect(screen.getByRole("textbox")).toHaveProperty("value", "external");
    expect(
      screen.getByRole("slider", { name: "Frühestes Erscheinungsjahr" }),
    ).toHaveProperty("value", "1990");

    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(new URLSearchParams(window.location.search).get("q")).toBe(
      "external",
    );
    expect(new URLSearchParams(window.location.search).get("yearFrom")).toBe(
      "1990",
    );
  });
});
