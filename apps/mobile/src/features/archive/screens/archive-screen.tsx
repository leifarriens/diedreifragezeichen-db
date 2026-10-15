import { type SearchSort, useSearch } from "@ddfdb/client";
import { l } from "@ddfdb/core/labels";
import { Stack, useRouter } from "expo-router";

import { useFolgen } from "@/api/use-folgen";
import { useHydrateFolgenWithUserData } from "@/api/use-hydrate-folgen-with-user-data";
import { buildHeaderSortMenu } from "@/components/header-sort-menu";
import { Logo } from "@/components/logo";
import { useArchiveFilters } from "@/features/archive/context/archive-filter-provider";
import { FolgenList } from "@/features/folgen-list/folgen-list";
import { useViewMode } from "@/features/folgen-list/view-mode";

export function ArchiveScreen() {
  const router = useRouter();

  const { searchCriteria, state, updateState } = useArchiveFilters();
  const folgenQuery = useFolgen();
  const { viewMode, viewModeMenu } = useViewMode();

  const searchQuery = useSearch(folgenQuery.data ?? [], searchCriteria);

  const hydratedFolgen = useHydrateFolgenWithUserData(
    searchQuery.data?.results ?? folgenQuery.data ?? [],
  );

  const displayedFolgen = hydratedFolgen;

  return (
    <>
      <Stack.Screen
        options={{
          headerSearchBarOptions: {
            hideWhenScrolling: false,
            onChangeText: (event) => {
              updateState({ term: event.nativeEvent.text });
            },
            placeholder: l.ARCHIVE.SEARCH_PLACEHOLDER,
            placement: "integratedCentered",
          },
          headerShown: true,
          headerTitle: () => <Logo />,
          title: "",
          unstable_headerLeftItems: () => [
            {
              icon: { name: "line.3.horizontal.decrease", type: "sfSymbol" },
              label: "Filter",
              onPress() {
                router.navigate("/(tabs)/(archiv)/filter");
              },
              type: "button",
            },
          ],
          unstable_headerRightItems: () => [
            ...viewModeMenu,
            ...buildHeaderSortMenu({
              label: l.ARCHIVE.SORTING.LABEL,
              onSortValueChange(sort) {
                updateState({ sort });
              },
              options: sortOptions,
              sortValue: state.sort,
            }),
          ],
        }}
      />

      <FolgenList
        detailPathname="/(tabs)/(archiv)/[folgeId]"
        emptyMessage={l.MISC.NO_FOLGEN_FOUND}
        folgen={displayedFolgen}
        isInitialLoading={folgenQuery.isLoading}
        viewMode={viewMode}
      />
    </>
  );
}

const sortOptions: { label: string; value: SearchSort }[] = [
  {
    label: l.ARCHIVE.SORTING.NEWEST_FIRST,
    value: "newest",
  },
  {
    label: l.ARCHIVE.SORTING.OLDEST_FIRST,
    value: "oldest",
  },
  {
    label: l.ARCHIVE.SORTING.HIGHEST_RATED_FIRST,
    value: "rating",
  },
];
