"use client";

import { useState } from "react";
import { cn } from "tailwind-variants";

import { useArchiveFilters } from "../archive/archive-filters-provider";

interface SearchInputProps {
  className?: string;
}

export function SearchInput({ className }: SearchInputProps) {
  const { filters, isArchivePage, updateFilters } = useArchiveFilters();
  const [searchDraft, setSearchDraft] = useState("");
  const value = isArchivePage ? filters.searchTerm : searchDraft;

  return (
    <div className={cn("relative w-full", className)}>
      <input
        aria-label="Folgen suchen"
        autoComplete="off"
        className="w-full rounded-3xl bg-black/80 px-6 py-2 text-[16px] text-white backdrop-blur-xs backdrop-brightness-50 transition-all sm:py-2.5"
        name="search"
        onChange={(e) => {
          if (isArchivePage) updateFilters({ searchTerm: e.target.value });
          else setSearchDraft(e.target.value);
        }}
        placeholder="Name, Nummer oder Erscheinungsjahr"
        type="search"
        value={value}
      />
    </div>
  );
}
