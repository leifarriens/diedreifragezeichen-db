"use client";

import type { SearchSort, SearchState } from "@ddfdb/client";
import type { SearchCriteria, SortOption } from "@ddfdb/core/search";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { CURRENT_YEAR } from "@/app/constants";

import {
  createDefaultSearchState,
  readSearchState,
  type SearchStateField,
  writeSearchState,
} from "../search-state-url";

const SEARCH_ROUTE = "/search";
const TEXT_PERSISTENCE_DELAY = 250;

const initialState: Omit<SearchState, "yearRange"> = {
  authors: [],
  collections: [],
  roles: [],
  scriptAuthors: [],
  sort: "newest",
  speakers: [],
  term: "",
};

const searchSortOptions: Record<SearchSort, SortOption> = {
  newest: { by: "release_date", order: "DESC" },
  oldest: { by: "release_date", order: "ASC" },
  rating: { by: "communityRating", order: "DESC" },
};

export type SearchNavigationHandler = (
  pathname: string,
  search: string,
  forceRestore?: boolean,
) => void;

export function useSearchState(currentYear = CURRENT_YEAR) {
  const defaults = useMemo(
    () => createDefaultSearchState(currentYear),
    [currentYear],
  );
  const [state, setState] = useState<SearchState>(() => defaults);
  const [navigationRevision, setNavigationRevision] = useState(0);
  const stateRef = useRef(state);
  const textTimerRef = useRef<null | ReturnType<typeof setTimeout>>(null);
  const interactionGenerationRef = useRef(0);
  const observedLocationRef = useRef<null | string>(null);
  const hasRestoredLocationRef = useRef(false);

  const cancelPendingTextWrite = useCallback(() => {
    if (textTimerRef.current !== null) {
      clearTimeout(textTimerRef.current);
      textTimerRef.current = null;
    }
  }, []);

  const onExternalNavigation = useCallback<SearchNavigationHandler>(
    (pathname, search, forceRestore = false) => {
      if (
        typeof window === "undefined" ||
        window.location.pathname !== pathname ||
        window.location.search !== toSearch(search)
      ) {
        return;
      }

      const nextLocation = getLocationKey(pathname, search);
      if (!forceRestore && observedLocationRef.current === nextLocation) return;

      cancelPendingTextWrite();
      interactionGenerationRef.current += 1;
      observedLocationRef.current = nextLocation;

      if (pathname !== SEARCH_ROUTE) {
        hasRestoredLocationRef.current = false;
        setNavigationRevision((revision) => revision + 1);
        return;
      }

      const nextState = readSearchState(search, currentYear);
      stateRef.current = nextState;
      setState(nextState);
      setNavigationRevision((revision) => revision + 1);
      hasRestoredLocationRef.current = true;
    },
    [cancelPendingTextWrite, currentYear],
  );

  const commitFields = useCallback(
    (fields: readonly SearchStateField[], nextState = stateRef.current) => {
      if (
        typeof window === "undefined" ||
        !hasRestoredLocationRef.current ||
        window.location.pathname !== SEARCH_ROUTE
      ) {
        return;
      }

      const url = new URL(window.location.href);
      const currentLocation = getLocationKey(url.pathname, url.search);
      if (observedLocationRef.current !== currentLocation) {
        onExternalNavigation(url.pathname, url.search);
        return;
      }

      const nextSearch = writeSearchState(
        url.search,
        nextState,
        currentYear,
        fields,
      );
      if (new URLSearchParams(url.search).toString() === nextSearch) return;

      url.search = nextSearch;
      window.history.replaceState(
        null,
        "",
        `${url.pathname}${url.search}${url.hash}`,
      );
      observedLocationRef.current = getLocationKey(url.pathname, url.search);
    },
    [currentYear, onExternalNavigation],
  );

  const updateState = useCallback(
    (updates: Partial<SearchState>) => {
      if (
        typeof window !== "undefined" &&
        window.location.pathname !== SEARCH_ROUTE
      ) {
        return;
      }

      const nextState = { ...stateRef.current, ...updates };
      stateRef.current = nextState;
      setState(nextState);

      const changedFields = Object.keys(updates) as SearchStateField[];
      if (changedFields.includes("term")) {
        cancelPendingTextWrite();
        if (hasRestoredLocationRef.current) {
          const generation = interactionGenerationRef.current;
          textTimerRef.current = setTimeout(() => {
            textTimerRef.current = null;
            if (generation !== interactionGenerationRef.current) return;

            const currentLocation = getLocationKey(
              window.location.pathname,
              window.location.search,
            );
            if (currentLocation !== observedLocationRef.current) {
              onExternalNavigation(
                window.location.pathname,
                window.location.search,
              );
              return;
            }

            commitFields(["term"]);
          }, TEXT_PERSISTENCE_DELAY);
        }
      }

      const immediateFields = changedFields.filter((field) => field !== "term");
      if (immediateFields.length > 0) commitFields(immediateFields, nextState);
    },
    [cancelPendingTextWrite, commitFields, onExternalNavigation],
  );

  const resetState = useCallback(() => {
    cancelPendingTextWrite();
    interactionGenerationRef.current += 1;
    stateRef.current = defaults;
    setState(defaults);
    setNavigationRevision((revision) => revision + 1);
    commitFields(
      [
        "term",
        "sort",
        "authors",
        "collections",
        "roles",
        "scriptAuthors",
        "speakers",
        "yearRange",
      ],
      defaults,
    );
  }, [cancelPendingTextWrite, commitFields, defaults]);

  useEffect(() => {
    function handlePopState() {
      onExternalNavigation(
        window.location.pathname,
        window.location.search,
        true,
      );
    }

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [onExternalNavigation]);

  useEffect(
    () => () => {
      cancelPendingTextWrite();
      interactionGenerationRef.current += 1;
    },
    [cancelPendingTextWrite],
  );

  const searchCriteria = useMemo<SearchCriteria>(
    () => ({
      filters: {
        authors: state.authors,
        collections: state.collections,
        roles: state.roles,
        script_authors: state.scriptAuthors,
        speakers: state.speakers,
        yearRange: state.yearRange,
      },
      sort: searchSortOptions[state.sort],
      term: state.term,
    }),
    [state],
  );

  return {
    initialState,
    navigationRevision,
    onExternalNavigation,
    resetState,
    searchCriteria,
    state,
    updateState,
  };
}

function getLocationKey(pathname: string, search: string) {
  return `${pathname}${toSearch(search)}`;
}

function toSearch(search: string) {
  if (search === "" || search.startsWith("?")) return search;
  return `?${search}`;
}
