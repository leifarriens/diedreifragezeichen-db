// @vitest-environment jsdom

import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ArchiveBrowserSearchCriteria } from "../components/archive-browser-search-criteria";
import {
  ArchiveSearchStateProvider,
  useArchiveSearchState,
} from "./archive-search-state-provider";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

afterEach(() => {
  vi.useRealTimers();
  window.history.replaceState(null, "", "/");
});

describe("ArchiveSearchStateProvider", () => {
  it("keeps the specials switch off after writing zero to the URL", () => {
    window.history.replaceState(null, "", "/");

    render(
      <ArchiveSearchStateProvider currentYear={2025}>
        <ArchiveCriteriaSwitch />
      </ArchiveSearchStateProvider>,
    );

    const toggle = screen.getByRole("switch");
    expect(toggle.getAttribute("aria-checked")).toBe("true");

    fireEvent.click(toggle);

    expect(new URLSearchParams(window.location.search).get("specials")).toBe(
      "0",
    );
    expect(toggle.getAttribute("aria-checked")).toBe("false");

    act(() => {
      window.dispatchEvent(new PopStateEvent("popstate"));
    });

    expect(toggle.getAttribute("aria-checked")).toBe("false");
  });

  it("restores combobox filters from the URL and persists updates", () => {
    window.history.replaceState(
      null,
      "",
      "/?speakers=Dorette+Hugo&roles=Hugenay&authors=Andr%C3%A9+Marx&scriptAuthors=Andr%C3%A9+Minninger",
    );

    render(
      <ArchiveSearchStateProvider currentYear={2025}>
        <SearchFilters />
      </ArchiveSearchStateProvider>,
    );

    expect(
      screen.getByText(
        '{"authors":["André Marx"],"roles":["Hugenay"],"scriptAuthors":["André Minninger"],"speakers":["Dorette Hugo"]}',
      ),
    ).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Change filters" }));

    const params = new URLSearchParams(window.location.search);
    expect(params.getAll("speakers")).toEqual(["Oliver Rohrbeck"]);
    expect(params.getAll("roles")).toEqual(["Hugenay"]);
    expect(params.getAll("authors")).toEqual(["H. G. Francis"]);
    expect(params.getAll("scriptAuthors")).toEqual(["André Minninger"]);
  });

  it("restores the year range slider value from the URL", async () => {
    window.history.replaceState(null, "", "/?yearTo=2016");
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
      function (this: HTMLElement) {
        return this.hasAttribute("data-index")
          ? new DOMRect(0, 0, 24, 24)
          : new DOMRect(0, 0, 300, 44);
      },
    );

    render(
      <ArchiveSearchStateProvider currentYear={2025}>
        <ArchiveCriteriaSwitch />
      </ArchiveSearchStateProvider>,
    );

    expect(
      await screen.findByRole("slider", { name: "Spätestes Erscheinungsjahr" }),
    ).toHaveProperty("value", "2016");
  });

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

function ArchiveCriteriaSwitch() {
  const { currentYear, state, updateState } = useArchiveSearchState();

  return (
    <ArchiveBrowserSearchCriteria
      availableOptions={{
        authors: [],
        collections: [],
        roles: [],
        scriptAuthors: [],
        speakers: [],
      }}
      currentYear={currentYear}
      onChange={updateState}
      state={state}
    />
  );
}

function CurrentYear() {
  const { currentYear, state } = useArchiveSearchState();

  return (
    <span>
      year {currentYear.toString()}; max {state.yearRange.max.toString()}
    </span>
  );
}

function SearchFilters() {
  const { state, updateState } = useArchiveSearchState();

  return (
    <>
      <output>
        {JSON.stringify({
          authors: state.authors,
          roles: state.roles,
          scriptAuthors: state.scriptAuthors,
          speakers: state.speakers,
        })}
      </output>
      <button
        onClick={() => {
          updateState({
            authors: ["H. G. Francis"],
            speakers: ["Oliver Rohrbeck"],
          });
        }}
        type="button"
      >
        Change filters
      </button>
    </>
  );
}
