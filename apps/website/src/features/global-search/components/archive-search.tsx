"use client";

import { useDebouncedCallback } from "@ddfdb/client/utils";
import { l } from "@ddfdb/core/labels";
import { useRef, useState } from "react";
import { cn } from "tailwind-variants";

import { useArchiveSearchState } from "@/features/archive/context/archive-search-state-provider";

import { useSearchShortcut } from "../hooks/use-search-shortcut";
import { SearchField, searchInputVariant } from "./search-field";

interface ArchiveSearchProps {
  className?: string | undefined;
  platform: "macos" | "other";
}

export function ArchiveSearch({ className, platform }: ArchiveSearchProps) {
  const { state, updateState } = useArchiveSearchState();
  const [searchDraft, setSearchDraft] = useState<null | {
    baseTerm: string;
    value: string;
  }>(null);
  const searchTerm =
    searchDraft?.baseTerm === state.term ? searchDraft.value : state.term;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [updateTermDebounced, cancelUpdateTerm] = useDebouncedCallback(
    (term: string) => {
      setSearchDraft(null);
      updateState({ term });
    },
    200,
  );

  useSearchShortcut(() => {
    inputRef.current?.focus();
  });

  function clearSearch() {
    cancelUpdateTerm();
    setSearchDraft(null);
    updateState({ term: "" });
    inputRef.current?.focus();
  }

  return (
    <SearchField
      className={className}
      onClick={() => inputRef.current?.focus()}
      platform={platform}
    >
      <input
        aria-label={l.ARCHIVE.SEARCH_LABEL}
        className={searchInputVariant({
          className: "focus:pr-10 any-pointer-coarse:pr-10",
        })}
        name="archiv-search"
        onChange={(event) => {
          const term = event.target.value;
          setSearchDraft({ baseTerm: state.term, value: term });
          updateTermDebounced(term);
        }}
        onKeyDown={(event) => {
          if (event.key !== "Escape" || event.nativeEvent.isComposing) return;

          event.preventDefault();
          clearSearch();
        }}
        placeholder={l.ARCHIVE.SEARCH_PLACEHOLDER}
        ref={inputRef}
        value={searchTerm}
      />
      {searchTerm && (
        <button
          aria-label="Suche leeren"
          className={cn(
            "absolute top-1/2 right-3 hidden h-8 -translate-y-1/2 items-center justify-center text-neutral-500 group-focus-within:flex hover:text-neutral-300",
          )}
          onClick={clearSearch}
          type="button"
        >
          <svg
            aria-hidden="true"
            className="size-6"
            fill="currentColor"
            height="32"
            viewBox="0 0 256 256"
            width="32"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
          </svg>
        </button>
      )}
    </SearchField>
  );
}
