import { type FolgeListItem, useSearch } from "@ddfdb/client";
import { sortFolgen, type UserDataSortOption } from "@ddfdb/core";
import { Stack } from "expo-router";
import { useMemo, useState } from "react";

import type { FolgeDetailPathname } from "@/features/folgen-list/folgen-list-item";

import { useHydrateFolgenWithUserData } from "@/api/use-hydrate-folgen-with-user-data";
import { buildHeaderSortMenu } from "@/components/header-sort-menu";
import { FolgenList } from "@/features/folgen-list/folgen-list";

export interface UserCollectionSortChoice {
  label: string;
  sort: UserDataSortOption;
  value: string;
}

interface UserCollectionProps<
  Options extends readonly UserCollectionSortChoice[],
> {
  detailPathname: FolgeDetailPathname;
  emptyMessage: string;
  folgen: FolgeListItem[];
  initialSortValue: NoInfer<Options[number]["value"]>;
  isInitialLoading: boolean;
  isRefreshing: boolean;
  onRequestRefresh: () => void;
  searchPlaceholder: string;
  sortLabel: string;
  sortOptions: Options;
  title: string;
}

export function UserCollection<
  const Options extends readonly UserCollectionSortChoice[],
>({
  detailPathname,
  emptyMessage,
  folgen,
  initialSortValue,
  isInitialLoading,
  isRefreshing,
  onRequestRefresh,
  searchPlaceholder,
  sortLabel,
  sortOptions,
  title,
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

  const searchQuery = useSearch(folgen, { term: searchTerm });
  const hydratedFolgen = useHydrateFolgenWithUserData(
    searchQuery.data?.results ?? folgen,
  );
  const displayedFolgen = useMemo(
    () => sortFolgen(hydratedFolgen, selectedOption.sort),
    [hydratedFolgen, selectedOption.sort],
  );

  return (
    <>
      <Stack.Screen
        options={{
          headerSearchBarOptions: {
            hideWhenScrolling: false,
            onChangeText: (event) => {
              setSearchTerm(event.nativeEvent.text);
            },
            placeholder: searchPlaceholder,
            placement: "integratedCentered",
          },
          title,
          unstable_headerRightItems: () =>
            buildHeaderSortMenu({
              label: sortLabel,
              onSortValueChange: setSortValue,
              options: sortOptions,
              sortValue,
            }),
        }}
      />

      <FolgenList
        detailPathname={detailPathname}
        emptyMessage={folgen.length === 0 ? emptyMessage : undefined}
        folgen={displayedFolgen}
        isInitialLoading={isInitialLoading}
        isRefreshing={isRefreshing}
        onRequestRefresh={onRequestRefresh}
        viewMode="list"
      />
    </>
  );
}
