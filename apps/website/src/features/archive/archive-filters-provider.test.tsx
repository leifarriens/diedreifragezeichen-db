// @vitest-environment jsdom

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { useState } from "react";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { FolgeWithCommunityRating } from "@/lib/types";

import { SearchInput } from "../global-search/search-input";
import ArchiveBrowser from "./components/archive-browser";
import { ArchiveFiltersProvider } from "./components/archive-filters-provider";

const route = vi.hoisted(() => ({ pathname: "/" }));
vi.mock("next/navigation", () => ({ usePathname: () => route.pathname }));
vi.mock("@/components/folgen-grid/folgen-grid-item", () => ({
  FolgenGridItem: ({ folge }: { folge: FolgeWithCommunityRating }) => (
    <span data-testid="folge">{folge.title}</span>
  ),
}));
vi.mock("@/lib/use-hydrate-folgen-with-user-data", () => ({
  useHydrateFolgenWithUserData: (input: unknown[]) => input,
}));

const folgen = [
  {
    artwork: null,
    collection: "serie",
    communityRating: { numberOfRatings: 2, score: 2 },
    cover: null,
    description: null,
    id: 1,
    links: {},
    number: 1,
    release_date: "1980-01-01",
    title: "Der Super-Papagei",
    total_duration: null,
    weblink: null,
  },
  {
    artwork: null,
    collection: "serie",
    communityRating: { numberOfRatings: 4, score: 3 },
    cover: null,
    description: null,
    id: 2,
    links: {},
    number: 2,
    release_date: "2000-01-01",
    title: "Geisterhaus",
    total_duration: null,
    weblink: null,
  },
  {
    artwork: null,
    collection: "spezial",
    communityRating: null,
    cover: null,
    description: null,
    id: 3,
    links: {},
    number: null,
    release_date: "2010-01-01",
    title: "Geister Spezial",
    total_duration: null,
    weblink: null,
  },
] as FolgeWithCommunityRating[];

function App() {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ArchiveFiltersProvider currentYear={2026}>
        <SearchInput />
        {route.pathname === "/" && (
          <ArchiveBrowser archiveUnavailable={false} folgen={folgen} />
        )}
      </ArchiveFiltersProvider>
    </QueryClientProvider>
  );
}

function getTitles() {
  return screen.queryAllByTestId("folge").map((item) => item.textContent);
}

beforeEach(() => {
  route.pathname = "/";
  window.history.replaceState(null, "", "/");
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("URL-backed archive filtering", () => {
  it("restores every filter into the header, controls and results on a direct visit", () => {
    window.history.replaceState(
      null,
      "",
      "/?q=Geister&sort=oldest&yearFrom=1990&yearTo=2020&specials=1",
    );
    render(<App />);
    expect(
      screen.getByRole("combobox", { name: "Folgen Archiv durchsuchen" }),
    ).toHaveProperty("value", "Geister");
    expect(
      screen
        .getByRole("button", { name: "Älteste" })
        .getAttribute("aria-pressed"),
    ).toBe("true");
    expect(
      screen.getByRole("slider", { name: "Frühestes Erscheinungsjahr" }),
    ).toHaveProperty("value", "1990");
    expect(
      screen.getByRole("slider", { name: "Spätestes Erscheinungsjahr" }),
    ).toHaveProperty("value", "2020");
    expect(
      screen
        .getByRole("switch", { name: "Specials anzeigen" })
        .getAttribute("aria-checked"),
    ).toBe("true");
    expect(getTitles()).toEqual(["Geisterhaus", "Geister Spezial"]);
  });

  it("sorts by community rating from best to worst and keeps unrated Folgen last", () => {
    window.history.replaceState(null, "", "/?sort=rating&specials=1");
    render(<App />);

    expect(getTitles()).toEqual([
      "Geisterhaus",
      "Der Super-Papagei",
      "Geister Spezial",
    ]);
    expect(
      screen
        .getByRole("button", { name: "Beste" })
        .getAttribute("aria-pressed"),
    ).toBe("true");
  });

  it("filters locally, preserves other URL state and replaces rather than adds history entries", async () => {
    window.history.replaceState(null, "", "/?utm_source=link#archive");
    render(<App />);
    const replace = vi.spyOn(window.history, "replaceState");
    const push = vi.spyOn(window.history, "pushState");
    const historyLength = window.history.length;
    fireEvent.click(screen.getByRole("button", { name: "Älteste" }));
    expect(getTitles()).toEqual(["Der Super-Papagei", "Geisterhaus"]);
    fireEvent.change(
      screen.getByRole("combobox", { name: "Folgen Archiv durchsuchen" }),
      { target: { value: "Geister" } },
    );
    fireEvent.click(
      screen.getByRole("switch", { name: "Specials anzeigen" }),
    );
    fireEvent.change(
      screen.getByRole("slider", { name: "Spätestes Erscheinungsjahr" }),
      { target: { value: "2005" } },
    );
    await waitFor(() => {
      expect(getTitles()).toEqual(["Geisterhaus"]);
    });
    expect(new URLSearchParams(window.location.search).get("q")).toBe(
      "Geister",
    );
    expect(new URLSearchParams(window.location.search).get("yearTo")).toBe(
      "2005",
    );
    expect(new URLSearchParams(window.location.search).get("utm_source")).toBe(
      "link",
    );
    expect(window.location.hash).toBe("#archive");
    expect(replace).toHaveBeenCalledTimes(4);
    expect(push).not.toHaveBeenCalled();
    expect(window.history.length).toBe(historyLength);

    fireEvent.click(screen.getByRole("button", { name: "Suche zurücksetzen" }));
    expect(new URLSearchParams(window.location.search).has("q")).toBe(false);
    expect(
      screen.getByRole("combobox", { name: "Folgen Archiv durchsuchen" }),
    ).toHaveProperty("value", "");
  });

  it("restores the homepage after leaving while keeping other-page search separate", () => {
    window.history.replaceState(
      null,
      "",
      "/?q=Geister&sort=oldest&yearFrom=1990&yearTo=2020",
    );
    const { rerender } = render(<App />);
    const archiveURL = window.location.href;
    act(() => {
      window.history.pushState(null, "", "/folge/2");
      route.pathname = "/folge/2";
    });
    rerender(<App />);
    const search = screen.getByRole("combobox", {
      name: "Folgen Archiv durchsuchen",
    });
    expect(search).toHaveProperty("value", "");
    fireEvent.change(search, { target: { value: "Global search draft" } });
    expect(window.location.search).toBe("");

    act(() => {
      window.history.replaceState(null, "", archiveURL);
      route.pathname = "/";
      window.dispatchEvent(new PopStateEvent("popstate"));
    });
    rerender(<App />);
    expect(search).toHaveProperty("value", "Geister");
    expect(
      screen.getByRole("slider", { name: "Frühestes Erscheinungsjahr" }),
    ).toHaveProperty("value", "1990");
    expect(
      screen
        .getByRole("button", { name: "Älteste" })
        .getAttribute("aria-pressed"),
    ).toBe("true");
    expect(getTitles()).toEqual(["Geisterhaus"]);
  });

  it("restores Back/Forward state when the homepage stays mounted", () => {
    render(<App />);
    act(() => {
      window.history.replaceState(
        null,
        "",
        "/?q=Papagei&yearFrom=1979&yearTo=1990",
      );
      window.dispatchEvent(new PopStateEvent("popstate"));
    });
    expect(getTitles()).toEqual(["Der Super-Papagei"]);
    expect(
      screen.getByRole("slider", { name: "Spätestes Erscheinungsjahr" }),
    ).toHaveProperty("value", "1990");
    act(() => {
      window.history.replaceState(null, "", "/");
      window.dispatchEvent(new PopStateEvent("popstate"));
    });
    expect(
      screen.getByRole("combobox", { name: "Folgen Archiv durchsuchen" }),
    ).toHaveProperty("value", "");
    expect(
      screen.getByRole("slider", { name: "Spätestes Erscheinungsjahr" }),
    ).toHaveProperty("value", "2026");
    expect(getTitles()).toEqual(["Geisterhaus", "Der Super-Papagei"]);
  });

  it("keeps default archive content in the server-rendered HTML", () => {
    window.history.replaceState(null, "", "/?q=no-match&specials=1");
    const html = renderToString(<App />);
    expect(html).toContain("Geisterhaus");
    expect(html).toContain("Der Super-Papagei");
    expect(html).not.toContain("Geister Spezial");
    expect(html).not.toContain("no-match");
  });
});
