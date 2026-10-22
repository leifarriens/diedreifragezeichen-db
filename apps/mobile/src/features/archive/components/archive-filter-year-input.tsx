import type { SearchState } from "@ddfdb/client";

import { DateTimePicker } from "@expo/ui/community/datetime-picker";
import { Text, View } from "react-native";

const MIN_YEAR = 1979;
const CURRENT_YEAR = new Date().getFullYear();

// DISCUSS Might this be the better options? https://docs.expo.dev/versions/latest/sdk/ui/universal/picker/
export function YearRangePicker({
  onChange,
  yearRange,
}: {
  onChange: (yearRange: SearchState["yearRange"]) => void;
  yearRange: SearchState["yearRange"];
}) {
  return (
    <View className="gap-3">
      <Text className="text-base font-semibold">Erscheinungsjahr</Text>

      <View className="flex-row items-center justify-between gap-4">
        <Text>Von</Text>
        <DateTimePicker
          display="compact"
          locale="de_DE"
          maximumDate={yearToDate(
            Math.min(yearRange.max, CURRENT_YEAR),
            "last",
          )}
          minimumDate={yearToDate(MIN_YEAR, "first")}
          mode="date"
          onValueChange={(_, date) => {
            onChange({
              ...yearRange,
              min: date.getFullYear(),
            });
          }}
          value={yearToDate(yearRange.min, "first")}
        />
      </View>

      <View className="flex-row items-center justify-between gap-4">
        <Text>Bis</Text>
        <DateTimePicker
          display="compact"
          locale="de_DE"
          maximumDate={yearToDate(CURRENT_YEAR, "last")}
          minimumDate={yearToDate(Math.max(yearRange.min, MIN_YEAR), "first")}
          mode="date"
          onValueChange={(_, date) => {
            onChange({
              ...yearRange,
              max: date.getFullYear(),
            });
          }}
          value={yearToDate(yearRange.max, "last")}
        />
      </View>
    </View>
  );
}

function yearToDate(year: number, dayOfYear: "first" | "last") {
  return dayOfYear === "last" ? new Date(year, 11, 31) : new Date(year, 0, 1);
}
