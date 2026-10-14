import type { Collection } from "@ddfdb/archiv/contracts";
import type { SearchState } from "@ddfdb/client";

export const FIRST_RELEASE_YEAR = 1979;

export type SearchStateField = keyof SearchState;

const ALL_SEARCH_STATE_FIELDS: readonly SearchStateField[] = [
  "term",
  "sort",
  "authors",
  "collections",
  "roles",
  "scriptAuthors",
  "speakers",
  "yearRange",
];

export function createDefaultSearchState(currentYear: number): SearchState {
  return {
    authors: [],
    collections: [],
    roles: [],
    scriptAuthors: [],
    sort: "newest",
    speakers: [],
    term: "",
    yearRange: { max: currentYear, min: FIRST_RELEASE_YEAR },
  };
}

export function readSearchState(
  search: string,
  currentYear: number,
): SearchState {
  const params = new URLSearchParams(search);
  const maxYear = Math.max(currentYear, FIRST_RELEASE_YEAR + 1);
  const max = Math.max(
    readYear(params.get("yearTo"), currentYear, currentYear),
    FIRST_RELEASE_YEAR + 1,
  );
  const min = Math.min(
    readYear(params.get("yearFrom"), FIRST_RELEASE_YEAR, currentYear),
    max - 1,
  );
  const sort = params.get("sort");

  return {
    authors: readSelections(params, "authors"),
    collections: readSelections(params, "collections").filter(isCollection),
    roles: readSelections(params, "roles"),
    scriptAuthors: readSelections(params, "scriptAuthors"),
    sort: sort === "oldest" || sort === "rating" ? sort : "newest",
    speakers: readSelections(params, "speakers"),
    term: params.get("q") ?? "",
    yearRange: {
      max: Math.min(max, maxYear),
      min: Math.max(min, FIRST_RELEASE_YEAR),
    },
  };
}

export function writeSearchState(
  search: string,
  state: SearchState,
  currentYear: number,
  fields: readonly SearchStateField[] = ALL_SEARCH_STATE_FIELDS,
): string {
  const params = new URLSearchParams(search);
  const fieldsToWrite = new Set(fields);

  if (fieldsToWrite.has("term")) setValue(params, "q", state.term);
  if (fieldsToWrite.has("sort")) {
    setValue(params, "sort", state.sort === "newest" ? "" : state.sort);
  }
  if (fieldsToWrite.has("authors")) {
    setSelections(params, "authors", state.authors);
  }
  if (fieldsToWrite.has("collections")) {
    setSelections(params, "collections", state.collections);
  }
  if (fieldsToWrite.has("roles")) setSelections(params, "roles", state.roles);
  if (fieldsToWrite.has("scriptAuthors")) {
    setSelections(params, "scriptAuthors", state.scriptAuthors);
  }
  if (fieldsToWrite.has("speakers")) {
    setSelections(params, "speakers", state.speakers);
  }
  if (fieldsToWrite.has("yearRange")) {
    const yearRange = normalizeYearRange(state.yearRange, currentYear);
    setValue(
      params,
      "yearFrom",
      yearRange.min === FIRST_RELEASE_YEAR ? "" : String(yearRange.min),
    );
    setValue(
      params,
      "yearTo",
      yearRange.max === currentYear ? "" : String(yearRange.max),
    );
  }

  return params.toString();
}

function isCollection(value: string): value is Collection {
  return value === "serie" || value === "specials";
}

function normalizeYearRange(
  yearRange: SearchState["yearRange"],
  currentYear: number,
) {
  const maxYear = Math.max(currentYear, FIRST_RELEASE_YEAR + 1);
  const max = Math.min(
    Math.max(yearRange.max, FIRST_RELEASE_YEAR + 1),
    maxYear,
  );
  const min = Math.min(Math.max(yearRange.min, FIRST_RELEASE_YEAR), max - 1);

  return { max, min };
}

function readSelections(params: URLSearchParams, key: string): string[] {
  return [...new Set(params.getAll(key).filter((value) => value !== ""))];
}

function readYear(value: null | string, fallback: number, currentYear: number) {
  if (!value || !/^\d+$/.test(value)) return fallback;
  const year = Number(value);
  if (!Number.isSafeInteger(year)) return fallback;
  return Math.min(Math.max(year, FIRST_RELEASE_YEAR), currentYear);
}

function setSelections(
  params: URLSearchParams,
  key: string,
  values: readonly string[],
) {
  params.delete(key);
  for (const value of new Set(values.filter((entry) => entry !== ""))) {
    params.append(key, value);
  }
}

function setValue(params: URLSearchParams, key: string, value: string) {
  if (value === "") params.delete(key);
  else params.set(key, value);
}
