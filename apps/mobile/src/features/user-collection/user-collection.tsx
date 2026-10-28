import { type FolgeListItem, useSearch } from "@ddfdb/client";
import { sortFolgen, type UserDataSortOption } from "@ddfdb/core";
import { Stack, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { ScrollView, Text } from "react-native";

import type { FolgeDetailPathname } from "@/features/folgen-list/folgen-list-item";

import { useHydrateFolgenWithUserData } from "@/api/use-hydrate-folgen-with-user-data";
import { buildHeaderSortMenu } from "@/components/header-sort-menu";
import { UIButton } from "@/components/ui/button";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { FolgenList } from "@/features/folgen-list/folgen-list";

import { FolgenListEmptyContainer } from "../folgen-list/folgen-list-empty-container";

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
  unauthenticatedMessage: string;
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
  unauthenticatedMessage,
}: UserCollectionProps<Options>) {
  type Value = Options[number]["value"];
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortValue, setSortValue] = useState<Value>(initialSortValue);
  const selectedOption = sortOptions.find(
    (option) => option.value === sortValue,
  );

  if (!selectedOption) {
    throw new Error(`Unknown collection sort value: ${sortValue}`);
  }

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

      {!isAuthenticated ? (
        <ScrollView className="flex-1">
          <FolgenListEmptyContainer>
            <Text className="mb-4 text-center text-xl text-white">
              {unauthenticatedMessage}
            </Text>
            <UIButton
              intent="prominent"
              label="Anmelden"
              onPress={() => {
                router.push("/login");
              }}
              size="regular"
            />
          </FolgenListEmptyContainer>
        </ScrollView>
      ) : (
        <CollectionFolgenList
          detailPathname={detailPathname}
          emptyMessage={emptyMessage}
          folgen={folgen}
          isInitialLoading={isInitialLoading}
          isRefreshing={isRefreshing}
          onRequestRefresh={onRequestRefresh}
          searchTerm={searchTerm}
          selectedOption={selectedOption}
        />
      )}
    </>
  );
}

function CollectionFolgenList<
  const Options extends readonly UserCollectionSortChoice[],
>({
  folgen,
  searchTerm,
  selectedOption,
  ...rest
}: Pick<
  UserCollectionProps<Options>,
  | "detailPathname"
  | "emptyMessage"
  | "folgen"
  | "isInitialLoading"
  | "isRefreshing"
  | "onRequestRefresh"
> & {
  searchTerm: string;
  selectedOption: UserCollectionSortChoice;
}) {
  const searchQuery = useSearch(folgen, { term: searchTerm });
  const hydratedFolgen = useHydrateFolgenWithUserData(
    searchQuery.data?.results ?? folgen,
  );
  const displayedFolgen = useMemo(
    () => sortFolgen(hydratedFolgen, selectedOption.sort),
    [hydratedFolgen, selectedOption.sort],
  );

  return <FolgenList folgen={displayedFolgen} {...rest} viewMode="list" />;
}
