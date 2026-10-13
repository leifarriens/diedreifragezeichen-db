import type { SearchState } from "@ddfdb/client";

// import { Button, Host, Picker, Row, Spacer, Text } from "@expo/ui";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, View } from "react-native";

import { UIButton } from "@/components/ui/button";

import { YearRangePicker } from "../components/archive-filter-year-input";
import { useArchiveFilters } from "../context/archive-filter-provider";

const MIN_YEAR = 1979;
const CURRENT_YEAR = new Date().getFullYear();

export function ArchiveFilterScreen() {
  const router = useRouter();
  // const searchOptionsQuery = useFolgenSearchOptions();
  const { state, updateState } = useArchiveFilters();
  const [stateDraft, setStateDraft] = useState<SearchState>(state);

  function cancel() {
    setStateDraft(state);
    router.back();
  }

  function reset() {
    setStateDraft({
      ...state,
      yearRange: { max: CURRENT_YEAR, min: MIN_YEAR },
    });
  }

  function apply() {
    updateState({ yearRange: stateDraft.yearRange });
    router.back();
  }
  return (
    <>
      <Stack.Screen
        options={{
          title: "Filter",
          unstable_headerLeftItems: () => [
            {
              accessibilityLabel: "Abbrechen",
              icon: { name: "xmark", type: "sfSymbol" },
              label: "Abbrechen",
              onPress: cancel,
              type: "button",
            },
          ],
          unstable_headerRightItems: () => [
            {
              accessibilityLabel: "Anwenden",
              icon: { name: "checkmark", type: "sfSymbol" },
              label: "Anwenden",
              onPress: apply,
              type: "button",
            },
          ],
        }}
      />
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-8"
        contentInsetAdjustmentBehavior="automatic"
      >
        <View className="flex-1 gap-6">
          <YearRangePicker
            onChange={(yearRange) => {
              setStateDraft((currentDraft) => ({
                ...currentDraft,
                yearRange,
              }));
            }}
            yearRange={stateDraft.yearRange}
          />
        </View>

        <View className="mt-24 items-center">
          <UIButton label="Zurücksetzen" onPress={reset} size="regular" />
        </View>
      </ScrollView>
    </>
  );
}
