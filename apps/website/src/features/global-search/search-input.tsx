"use client";

import { Autocomplete } from "@base-ui/react/autocomplete";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import type { SearchResult } from "@/app/api/v0/search/route";

import { FolgenCover } from "@/components/folgen-images/folgen-cover";
import { useArchiveFilters } from "@/features/archive/components/archive-filters-provider";

import { useSearch } from "./use-search";

interface SearchInputProps {
  className?: string;
}

const ARCHIVE_SEARCH_DEBOUNCE_MS = 200;

export function SearchInput({ className }: SearchInputProps) {
  const { filters, isArchivePage, updateFilters } = useArchiveFilters();
  const [searchDraft, setSearchDraft] = useState("");
  const [archiveSearchDraft, setArchiveSearchDraft] = useState<null | {
    base: string;
    value: string;
  }>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const containerRef = useRef<HTMLLabelElement | null>(null);
  const archiveSearchTimeoutRef = useRef<null | ReturnType<typeof setTimeout>>(
    null,
  );

  useEffect(() => {
    if (
      !archiveSearchTimeoutRef.current ||
      (isArchivePage && archiveSearchDraft?.base === filters.searchTerm)
    ) {
      return;
    }
    clearTimeout(archiveSearchTimeoutRef.current);
    archiveSearchTimeoutRef.current = null;
  }, [archiveSearchDraft?.base, filters.searchTerm, isArchivePage]);

  useEffect(() => {
    function handlePopState() {
      if (archiveSearchTimeoutRef.current) {
        clearTimeout(archiveSearchTimeoutRef.current);
        archiveSearchTimeoutRef.current = null;
      }
      setArchiveSearchDraft(null);
    }

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  useEffect(
    () => () => {
      if (archiveSearchTimeoutRef.current) {
        clearTimeout(archiveSearchTimeoutRef.current);
      }
    },
    [],
  );

  const value =
    isArchivePage && archiveSearchDraft?.base === filters.searchTerm
      ? archiveSearchDraft.value
      : isArchivePage
        ? filters.searchTerm
        : searchDraft;

  const searchQuery = useSearch(searchDraft, { enabled: !isArchivePage });

  function renderStatus(): null | React.ReactNode {
    if (searchQuery.isFetching) {
      return <div className="sr-only">Searching…</div>;
    }

    if (searchDraft === "") {
      return null;
    }

    if (searchQuery.data?.length === 0) {
      return (
        <div className="sr-only">City {searchDraft} has no matches yet.</div>
      );
    }

    return (
      <div className="sr-only">
        {searchQuery.data?.length} result
        {searchQuery.data?.length === 1 ? "" : "s"} found
      </div>
    );
  }

  function handleValueChange(value: string) {
    if (!isArchivePage) {
      setSearchDraft(value);
      return;
    }

    setArchiveSearchDraft({ base: filters.searchTerm, value });
    if (archiveSearchTimeoutRef.current) {
      clearTimeout(archiveSearchTimeoutRef.current);
    }
    archiveSearchTimeoutRef.current = setTimeout(() => {
      archiveSearchTimeoutRef.current = null;
      setArchiveSearchDraft(null);
      updateFilters({ searchTerm: value });
    }, ARCHIVE_SEARCH_DEBOUNCE_MS);
  }

  function handleLinkClick() {
    setSearchDraft("");
    inputRef.current?.blur();
  }

  const status = renderStatus();

  return (
    <div className={className}>
      <Autocomplete.Root
        items={searchQuery.data}
        onValueChange={handleValueChange}
        value={value}
      >
        <label ref={containerRef}>
          <Autocomplete.Input
            aria-label="Folgen Archiv durchsuchen"
            className="h-full w-full rounded-xl border bg-transparent px-4 py-2 text-base text-gray-700 placeholder-gray-500 outline-none dark:text-neutral-100"
            placeholder="Name, Nummer oder Erscheinungsjahr"
            ref={inputRef}
          />
        </label>

        {!isArchivePage && (
          <Autocomplete.Portal hidden={!status}>
            <Autocomplete.Positioner
              anchor={containerRef}
              className="z-50 outline-none"
              sideOffset={4}
            >
              <Autocomplete.Popup
                aria-busy={searchQuery.isFetching || undefined}
                className="max-h-92 w-(--anchor-width) max-w-(--available-width) overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-stone-950"
              >
                <Autocomplete.Status>{status}</Autocomplete.Status>
                <Autocomplete.Empty className="px-4 py-3 text-sm empty:m-0 empty:p-0">
                  Keine Folgen gefunden
                </Autocomplete.Empty>
                <Autocomplete.List>
                  {(result: SearchResult) => (
                    <Link
                      href={`/folge/${result.id.toString()}`}
                      key={result.id}
                      onClick={handleLinkClick}
                    >
                      <Autocomplete.Item
                        className="flex items-center gap-4 px-4 py-3 text-sm data-highlighted:bg-gray-100 data-highlighted:text-gray-900"
                        value={result.title}
                      >
                        <div className="size-9">
                          {result.cover ? (
                            <FolgenCover
                              coverUrl={result.cover}
                              folgenTitle={result.title}
                            />
                          ) : (
                            <div className="bg-neutral-800" />
                          )}
                        </div>
                        {result.title}
                      </Autocomplete.Item>
                    </Link>
                  )}
                </Autocomplete.List>
              </Autocomplete.Popup>
            </Autocomplete.Positioner>
          </Autocomplete.Portal>
        )}
      </Autocomplete.Root>
    </div>
  );
}
