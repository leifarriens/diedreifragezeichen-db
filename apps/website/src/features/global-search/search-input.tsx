"use client";

import { Autocomplete } from "@base-ui/react/autocomplete";
import { Dialog } from "@base-ui/react/dialog";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

import { Kbd } from "@/components/ui/kbd/kbd";
import { useArchiveFilters } from "@/features/archive/components/archive-filters-provider";
import { FolgenCover } from "@/features/folgen/folgen-images/folgen-cover";

import type { SearchResult } from "./contracts";

import { useSearch } from "./use-search";

interface SearchInputProps {
  className?: string;
}

export function SearchInput({ className }: SearchInputProps) {
  const { filters, isArchivePage, updateFilters } = useArchiveFilters();
  const isMacOS = useSyncExternalStore(
    subscribeToPlatformChanges,
    getIsMacOS,
    () => false,
  );
  const [searchDraft, setSearchDraft] = useState("");
  const [archiveSearchDraft, setArchiveSearchDraft] = useState<null | {
    base: string;
    value: string;
  }>(null);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const containerRef = useRef<HTMLLabelElement | null>(null);
  const archiveSearchTimeoutRef = useRef<null | ReturnType<typeof setTimeout>>(
    null,
  );

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const modifierPressed = getIsMacOS()
        ? event.metaKey && !event.ctrlKey
        : event.ctrlKey && !event.metaKey;

      if (
        modifierPressed &&
        !event.altKey &&
        !event.shiftKey &&
        (event.code === "KeyK" || event.key.toLowerCase() === "k")
      ) {
        event.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

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
    }, 200);
  }

  function handleLinkClick() {
    setSearchDraft("");
    inputRef.current?.blur();
    setOpen(false);
  }

  const status = renderStatus();

  if (isArchivePage) {
    return (
      <div>
        <label className="relative block" ref={containerRef}>
          <input
            aria-label="Folgen Archiv durchsuchen"
            className="h-full w-full rounded-xl border border-neutral-500 bg-transparent px-4 py-2 pr-24 text-base placeholder-gray-500 transition-colors outline-none hover:border-neutral-200 focus:border-neutral-200"
            onChange={(e) => {
              handleValueChange(e.target.value);
            }}
            placeholder="Name, Nummer oder Erscheinungsjahr"
            ref={inputRef}
            value={value}
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 right-3 flex -translate-y-1/2 items-center gap-1 text-neutral-500 any-pointer-coarse:hidden"
          >
            <Kbd>{isMacOS ? "⌘" : "Ctrl"}</Kbd>
            <span>+</span>
            <Kbd>K</Kbd>
          </span>
        </label>
      </div>
    );
  }

  return (
    <div className={className}>
      <Dialog.Root onOpenChange={setOpen} open={open}>
        <Dialog.Trigger
          aria-label="Folgen Archiv durchsuchen"
          className="relative block h-full w-full cursor-pointer rounded-xl border border-neutral-500 bg-transparent px-4 py-2 pr-24 text-base text-neutral-300 placeholder-gray-500 transition-colors outline-none hover:border-neutral-200 active:border-neutral-200"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 right-3 flex -translate-y-1/2 items-center gap-1 text-neutral-500 any-pointer-coarse:hidden"
          >
            <Kbd>{isMacOS ? "⌘" : "Ctrl"}</Kbd>
            <span>+</span>
            <Kbd>K</Kbd>
          </span>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 min-h-dvh bg-black opacity-50 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 supports-[-webkit-touch-callout:none]:absolute" />
          <Dialog.Popup className="fixed top-1/3 left-1/2 -mt-8 flex w-xl max-w-[calc(100vw-3rem)] -translate-x-1/2 flex-col overflow-hidden rounded-xl border border-neutral-700 bg-[#02090E] shadow-[0.25rem_0.25rem_0] shadow-black/12 transition-[scale,opacity] duration-100 ease-out data-ending-style:scale-[0.98] data-ending-style:opacity-0 data-starting-style:scale-[0.98] data-starting-style:opacity-0">
            <div className="relative">
              <Autocomplete.Root
                items={searchQuery.data}
                mode="none"
                onValueChange={handleValueChange}
                value={value}
              >
                <label className="block" ref={containerRef}>
                  <Autocomplete.Input
                    aria-label="Folgen Archiv durchsuchen"
                    className="h-full w-full border-b border-b-neutral-700 bg-transparent px-6 py-4 pr-24 text-base text-neutral-300 placeholder-gray-500 outline-none"
                    placeholder="Name, Nummer oder Erscheinungsjahr"
                    ref={inputRef}
                  />
                </label>

                <Autocomplete.Status>{status}</Autocomplete.Status>
                <Autocomplete.Empty className="px-4 py-3 text-sm empty:m-0 empty:p-0">
                  Keine Folgen gefunden
                </Autocomplete.Empty>
                <Autocomplete.List className="max-h-92 overflow-y-auto">
                  {(result: SearchResult) => (
                    <Link
                      href={`/folge/${result.id.toString()}`}
                      key={result.id}
                      onClick={handleLinkClick}
                    >
                      <Autocomplete.Item
                        className="flex items-center gap-4 px-4 py-3 text-sm data-highlighted:bg-neutral-900"
                        value={result.title}
                      >
                        <div className="size-20">
                          {result.cover ? (
                            <FolgenCover
                              className="rounded-lg"
                              coverUrl={result.cover}
                              folgenTitle={result.title}
                            />
                          ) : (
                            <div className="bg-neutral-800" />
                          )}
                        </div>
                        <div className="text-base font-medium text-neutral-300">
                          {result.number
                            ? `${result.number.toString()} · `
                            : ""}
                          {result.title}
                        </div>
                      </Autocomplete.Item>
                    </Link>
                  )}
                </Autocomplete.List>
              </Autocomplete.Root>
            </div>
            <div className="absolute top-2 right-2">
              <Dialog.Close className="flex h-8 items-center justify-center gap-2 px-3 text-sm leading-none font-normal whitespace-nowrap select-none hover:not-data-disabled:bg-neutral-100 focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-neutral-950 active:not-data-disabled:bg-neutral-200 disabled:border-neutral-500 disabled:text-neutral-500 data-disabled:border-neutral-500 data-disabled:text-neutral-500">
                Close
              </Dialog.Close>
            </div>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

function getIsMacOS() {
  return /Mac|iPhone|iPad|iPod/.test(navigator.platform);
}

function subscribeToPlatformChanges(onChange: () => void) {
  window.addEventListener("pageshow", onChange);
  return () => {
    window.removeEventListener("pageshow", onChange);
  };
}
