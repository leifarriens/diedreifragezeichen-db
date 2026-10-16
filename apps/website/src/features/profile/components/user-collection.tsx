"use client";

import {
  type FolgeWithCommunityRating,
  type UserDataSortOption,
} from "@ddfdb/core";
import { useState } from "react";

import { ToggleGroup } from "@/components/ui/toggle-group/toggle-group";
import { FolgenGrid } from "@/features/folgen/folgen-grid/folgen-grid";

import { useCollectionFolgen } from "../hooks/use-user-collection-folgen";
import { UserCollectionSearch } from "./user-collection-search";

export interface CollectionSortChoice {
  label: string;
  sort: UserDataSortOption;
  value: string;
}

interface UserCollectionProps<Options extends readonly CollectionSortChoice[]> {
  emptyMessage: string;
  folgen: FolgeWithCommunityRating[];
  /** Initial selection only. Remount with a new key to reset the collection. */
  initialSortValue: NoInfer<Options[number]["value"]>;
  searchPlaceholder: string;
  sortLabel: string;
  sortOptions: Options;
}

export function UserCollection<
  const Options extends readonly CollectionSortChoice[],
>({
  emptyMessage,
  folgen,
  initialSortValue,
  searchPlaceholder,
  sortLabel,
  sortOptions,
}: UserCollectionProps<Options>) {
  type Value = Options[number]["value"];

  const [searchTerm, setSearchTerm] = useState("");
  const [sortValue, setSortValue] = useState<Value>(initialSortValue);
  const selectedOption = sortOptions.find(
    (option) => option.value === sortValue,
  );

  if (!selectedOption) {
    throw new Error(`Unknown collection sort value: ${sortValue}`);
  }

  const displayedFolgen = useCollectionFolgen(
    folgen,
    searchTerm,
    selectedOption.sort,
  );

  return (
    <section className="space-y-6">
      <UserCollectionSearch
        onSearchTermChange={setSearchTerm}
        searchPlaceholder={searchPlaceholder}
        searchTerm={searchTerm}
        sortOptions={
          <ToggleGroup<Value>
            aria-label={sortLabel}
            onValueChange={setSortValue}
            options={sortOptions}
            value={sortValue}
          />
        }
      />

      <FolgenGrid
        emptyMessage={{
          title: folgen.length === 0 ? emptyMessage : undefined,
        }}
        folgen={displayedFolgen}
      />
    </section>
  );
}
