"use client";

import { Autocomplete } from "@base-ui/react/autocomplete";
import { Dialog } from "@base-ui/react/dialog";
import { useDebouncedCallback } from "@ddfdb/client/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState, useSyncExternalStore } from "react";

import { useArchiveSearchState } from "@/features/archive/context/archive-search-state-provider";
import { FolgenCover } from "@/features/folgen/folgen-images/folgen-cover";

import type { GlobalSearchResult } from "../contracts";

import { useGlobalSearch } from "../hooks/use-global-search";
import { useSearchShortcut } from "../hooks/use-search-shortcut";
import { getIsMacOS } from "../utils";
import { SEARCH_FIELD_CONTROL_CLASS_NAME, SearchField } from "./search-field";

interface ArchiveSearchProps {
  className?: string | undefined;
  platform: "macos" | "other";
}

interface SearchInputProps {
  className?: string | undefined;
}

interface SpotlightSearchProps {
  className?: string | undefined;
  platform: "macos" | "other";
}

export function GlobalSearchInput({ className }: SearchInputProps) {
  const pathname = usePathname();
  const isArchivePage = pathname === "/";

  const isMacOS = useSyncExternalStore(
    subscribeToPlatformChanges,
    getIsMacOS,
    () => false,
  );

  if (isArchivePage) {
    return (
      <ArchiveSearch
        className={className}
        platform={isMacOS ? "macos" : "other"}
      />
    );
  }

  return (
    <SpotlightSearch
      className={className}
      platform={isMacOS ? "macos" : "other"}
    />
  );
}

function ArchiveSearch({ className, platform }: ArchiveSearchProps) {
  const { state, updateState } = useArchiveSearchState();
  const [searchDraft, setSearchDraft] = useState<null | {
    baseTerm: string;
    value: string;
  }>(null);
  const searchTerm =
    searchDraft?.baseTerm === state.term ? searchDraft.value : state.term;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [updateTermDebounced] = useDebouncedCallback((term: string) => {
    setSearchDraft(null);
    updateState({ term });
  }, 200);

  useSearchShortcut(() => {
    inputRef.current?.focus();
  });

  return (
    <SearchField
      className={className}
      onClick={() => inputRef.current?.focus()}
      platform={platform}
    >
      <input
        aria-label="Folgen Archiv durchsuchen"
        className={SEARCH_FIELD_CONTROL_CLASS_NAME}
        name="archiv-search"
        onChange={(event) => {
          const term = event.target.value;
          setSearchDraft({ baseTerm: state.term, value: term });
          updateTermDebounced(term);
        }}
        placeholder="Name, Nummer oder Erscheinungsjahr"
        ref={inputRef}
        value={searchTerm}
      />
    </SearchField>
  );
}

function SpotlightSearch({ className, platform }: SpotlightSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const searchQuery = useGlobalSearch(searchTerm, {
    enabled: searchTerm.length > 2,
  });

  useSearchShortcut(() => {
    setIsOpen(true);
    inputRef.current?.focus();
  });

  function handleValueChange(value: string) {
    setSearchTerm(value);
  }

  function handleLinkClick() {
    setSearchTerm("");
    setIsOpen(false);
  }

  function renderStatus(): null | React.ReactNode {
    if (searchQuery.isFetching) {
      return <div className="sr-only">Searching…</div>;
    }

    if (searchTerm === "") {
      return null;
    }

    if (searchQuery.data?.length === 0) {
      return (
        <div className="sr-only">Folge {searchTerm} has no matches yet.</div>
      );
    }

    return (
      <div className="sr-only">
        {searchQuery.data?.length} result
        {searchQuery.data?.length === 1 ? "" : "s"} found
      </div>
    );
  }

  const status = renderStatus();

  return (
    <div className={className}>
      <Dialog.Root onOpenChange={setIsOpen} open={isOpen}>
        <SearchField
          onClick={() => {
            setIsOpen(true);
          }}
          platform={platform}
        >
          <Dialog.Trigger
            aria-label="Folgen Archiv durchsuchen"
            className={`${SEARCH_FIELD_CONTROL_CLASS_NAME} cursor-pointer text-nowrap active:border-neutral-200`}
          >
            <span className="block overflow-hidden text-left text-gray-500">
              Name, Nummer oder Erscheinungsjahr
            </span>
          </Dialog.Trigger>
        </SearchField>
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 min-h-dvh bg-black opacity-50 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 supports-[-webkit-touch-callout:none]:absolute" />
          <Dialog.Popup className="fixed top-1/3 left-1/2 -mt-8 flex w-xl max-w-[calc(100vw-3rem)] -translate-x-1/2 flex-col overflow-hidden rounded-xl border border-neutral-700 bg-[#02090E] shadow-[0.25rem_0.25rem_0] shadow-black/12 transition-[scale,opacity] duration-100 ease-out data-ending-style:scale-[0.98] data-ending-style:opacity-0 data-starting-style:scale-[0.98] data-starting-style:opacity-0">
            <div className="relative">
              <Autocomplete.Root
                items={searchQuery.data}
                mode="none"
                onValueChange={handleValueChange}
                value={searchTerm}
              >
                <div className="relative block">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-500 transition-colors group-focus-within:text-neutral-200">
                    <svg
                      aria-hidden="true"
                      className="size-6"
                      fill="currentColor"
                      height="32"
                      viewBox="0 0 256 256"
                      width="32"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" />
                    </svg>
                  </span>
                  <Autocomplete.Input
                    aria-label="Folgen Archiv durchsuchen"
                    className="h-full w-full border-b border-b-neutral-700 bg-transparent py-4 pr-26 pl-11 text-base text-neutral-300 placeholder-gray-500 outline-none"
                    placeholder="Name, Nummer oder Erscheinungsjahr"
                    ref={inputRef}
                  />
                  <div className="absolute top-1/2 right-3 -translate-y-1/2">
                    <Dialog.Close className="flex h-8 items-center justify-center text-neutral-500 hover:not-data-disabled:text-neutral-300">
                      <svg
                        className="size-6"
                        fill="currentColor"
                        height="32"
                        viewBox="0 0 256 256"
                        width="32"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>
                      </svg>
                    </Dialog.Close>
                  </div>
                </div>

                <Autocomplete.Status>{status}</Autocomplete.Status>
                <Autocomplete.Empty className="px-4 py-3 text-sm empty:m-0 empty:p-0">
                  Keine Folgen gefunden
                </Autocomplete.Empty>
                <Autocomplete.List className="max-h-92 overflow-y-auto">
                  {(result: GlobalSearchResult) => (
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
            {/* <div className="absolute top-2 right-2">
              <Dialog.Close className="flex h-8 items-center justify-center gap-2 px-3 text-sm leading-none font-normal whitespace-nowrap select-none hover:not-data-disabled:bg-neutral-100 focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-neutral-950 active:not-data-disabled:bg-neutral-200 disabled:border-neutral-500 disabled:text-neutral-500 data-disabled:border-neutral-500 data-disabled:text-neutral-500">
                Close
              </Dialog.Close>
            </div> */}
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

function subscribeToPlatformChanges(onChange: () => void) {
  window.addEventListener("pageshow", onChange);
  return () => {
    window.removeEventListener("pageshow", onChange);
  };
}
