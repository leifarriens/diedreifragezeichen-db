"use client";

import { useDebouncedCallback } from "@ddfdb/client/utils";
import { l } from "@ddfdb/core/labels";
import { useRef, useState } from "react";

import { useArchiveSearchState } from "@/features/archive/context/archive-search-state-provider";

import { useSearchShortcut } from "../hooks/use-search-shortcut";
import { SEARCH_FIELD_CONTROL_CLASS_NAME, SearchField } from "./search-field";

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
        aria-label={l.ARCHIVE.SEARCH_LABEL}
        className={SEARCH_FIELD_CONTROL_CLASS_NAME}
        name="archiv-search"
        onChange={(event) => {
          const term = event.target.value;
          setSearchDraft({ baseTerm: state.term, value: term });
          updateTermDebounced(term);
        }}
        placeholder={l.ARCHIVE.SEARCH_PLACEHOLDER}
        ref={inputRef}
        value={searchTerm}
      />
    </SearchField>
  );
}
