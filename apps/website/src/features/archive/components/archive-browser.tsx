"use client";

import type { SearchOptions } from "@ddfdb/archiv/contracts";
import type { FolgeWithCommunityRating } from "@ddfdb/core";

import { useSearch } from "@ddfdb/client";

import { Wrapper } from "@/components/ui/wrapper";
import { FolgenGrid } from "@/features/folgen/folgen-grid/folgen-grid";
import { useHydrateFolgenWithUserData } from "@/features/folgen/use-hydrate-folgen-with-user-data";

import { useArchiveSearchState } from "../context/archive-search-state-provider";
import { ArchiveBrowserSearchCriteria } from "./archive-browser-search-criteria";

interface ArchiveBrowserProps {
  availableOptions: SearchOptions;
  folgen: FolgeWithCommunityRating[];
}

export default function ArchiveBrowser({
  availableOptions,
  folgen,
}: ArchiveBrowserProps) {
  const { searchCriteria, state, updateState } = useArchiveSearchState();

  const searchQuery = useSearch(folgen, searchCriteria);

  const hydratedFolgen = useHydrateFolgenWithUserData(
    searchQuery.data?.results ?? folgen,
  );

  const displayedFolgen = hydratedFolgen;

  const includeSpecials = state.collections.length === 0;

  return (
    <Wrapper>
      <ArchiveBrowserSearchCriteria
        availableOptions={availableOptions}
        onChange={updateState}
        showAdditionalFilters={false}
        state={state}
      />

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p aria-live="polite" className="text-sm text-slate-300">
          <span className="font-semibold text-white">
            {displayedFolgen.length}
          </span>{" "}
          {displayedFolgen.length === 1 ? "Folge" : "Folgen"}
          {includeSpecials && (
            <span className="text-slate-400"> inklusive Specials</span>
          )}
        </p>
        {state.term && (
          <button
            className="text-sm font-medium text-sky-300 transition hover:text-sky-200"
            onClick={() => {
              updateState({ term: "" });
            }}
            type="button"
          >
            Suche zurücksetzen
          </button>
        )}
      </div>

      <FolgenGrid
        emptyMessage={{
          description: "Ändere deine Suche oder passe die Filter an.",
          title: "Keine Folgen gefunden",
        }}
        folgen={displayedFolgen}
      />
    </Wrapper>
  );
}
