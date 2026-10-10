import { useDebouncedValue } from "@ddfdb/client/utils";
import { Stack, useRouter } from "expo-router";
import { useMemo, useState } from "react";

import { useFolgen } from "@/api/use-folgen";
import { useHydrateFolgenWithUserData } from "@/api/use-hydrate-folgen-with-user-data";
import { buildHeaderSortMenu } from "@/components/header-sort-menu";
import { Logo } from "@/components/logo";
import {
  type ArchiveSortOrder,
  filterArchiveFolgen,
  sortArchiveFolgen,
} from "@/features/archive/archive-folgen";
import { FolgenList } from "@/features/folgen-list/folgen-list";
import { useViewMode } from "@/features/folgen-list/view-mode";
import { useArchiveFilters } from "@/providers/archive-filter-provider";

export function ArchiveScreen() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<ArchiveSortOrder>("newest");
  const debouncedSearch = useDebouncedValue(searchTerm);

  const {
    filters: { endDate, showSpecials, startDate },
  } = useArchiveFilters();
  const folgenQuery = useFolgen();
  const { viewMode, viewModeMenu } = useViewMode();

  const hydratedFolgen = useHydrateFolgenWithUserData(folgenQuery.data ?? []);

  const filteredFolgen = useMemo(
    () =>
      filterArchiveFolgen(hydratedFolgen, debouncedSearch, {
        endDate,
        showSpecials,
        startDate,
      }),
    [hydratedFolgen, debouncedSearch, showSpecials, startDate, endDate],
  );

  const displayedFolgen = useMemo(
    () => sortArchiveFolgen(filteredFolgen, sortOrder),
    [filteredFolgen, sortOrder],
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
            placeholder: "Titel, Nummer oder Erscheinungsjahr",
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
              onSortValueChange: setSortOrder,
              options: [
                { label: "Neueste", value: "newest" },
                { label: "Älteste", value: "oldest" },
                { label: "Beste", value: "rating" },
              ],
              sortValue: sortOrder,
            }),
          ],
        }}
      />

      <FolgenList
        detailPathname="/(tabs)/(archiv)/[folgeId]"
        emptyMessage="Keine Folgen im Archiv gefunden"
        folgen={displayedFolgen}
        isInitialLoading={folgenQuery.isLoading}
        viewMode={viewMode}
      />
    </>
  );
}
