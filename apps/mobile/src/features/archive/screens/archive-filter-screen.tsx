import { formatDateOnly, formatReleaseDate, isValidDate } from "@ddfdb/core";
import DateTimePicker from "@expo/ui/community/datetime-picker";
import { Stack, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import { useFolgen } from "@/api/use-folgen";
import { UIButton } from "@/components/ui/button";
import { UISwitch } from "@/components/ui/switch";
import {
  type ArchiveFilters,
  useArchiveFilters,
} from "@/providers/archive-filter-provider";

export function ArchiveFilterScreen() {
  const router = useRouter();
  const { filters, setFilters } = useArchiveFilters();
  const query = useFolgen();
  const [filterDraft, setFilterDraft] = useState<ArchiveFilters>(filters);
  const dateBounds = useMemo(() => {
    const releaseDates = (query.data ?? [])
      .flatMap((folge) =>
        folge.release_date === null ? [] : [folge.release_date],
      )
      .filter(isValidDate)
      .map(formatDateOnly)
      .sort();

    const firstDate = releaseDates[0];
    const lastDate = releaseDates.at(-1);
    return firstDate && lastDate ? { end: lastDate, start: firstDate } : null;
  }, [query.data]);

  function cancel() {
    setFilterDraft(filters);
    router.back();
  }

  function reset() {
    setFilterDraft({
      endDate: null,
      showSpecials: false,
      startDate: null,
    });
  }

  function apply() {
    setFilters((currentFilters) => ({
      ...currentFilters,
      endDate: filterDraft.endDate,
      showSpecials: filterDraft.showSpecials,
      startDate: filterDraft.startDate,
    }));
    router.back();
  }

  function changeStartDate(date: Date) {
    const nextDate = dateToDateOnly(date);
    setFilterDraft((currentDraft) => {
      const currentEndDate = currentDraft.endDate ?? dateBounds?.end;
      return {
        ...currentDraft,
        endDate:
          currentEndDate && nextDate > currentEndDate
            ? nextDate
            : currentDraft.endDate,
        startDate: nextDate,
      };
    });
  }

  function changeEndDate(date: Date) {
    const nextDate = dateToDateOnly(date);
    setFilterDraft((currentDraft) => {
      const currentStartDate = currentDraft.startDate ?? dateBounds?.start;
      return {
        ...currentDraft,
        endDate: nextDate,
        startDate:
          currentStartDate && nextDate < currentStartDate
            ? nextDate
            : currentDraft.startDate,
      };
    });
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
          <View className="gap-3">
            <Text className="text-base font-semibold">Erscheinungsdatum</Text>
            {dateBounds ? (
              <>
                <DatePickerRow
                  label="Von"
                  maximumDate={dateOnlyToDate(dateBounds.end)}
                  minimumDate={dateOnlyToDate(dateBounds.start)}
                  onValueChange={changeStartDate}
                  value={dateOnlyToDate(
                    filterDraft.startDate ?? dateBounds.start,
                  )}
                />
                <DatePickerRow
                  label="Bis"
                  maximumDate={dateOnlyToDate(dateBounds.end)}
                  minimumDate={dateOnlyToDate(dateBounds.start)}
                  onValueChange={changeEndDate}
                  value={dateOnlyToDate(filterDraft.endDate ?? dateBounds.end)}
                />
              </>
            ) : (
              <Text>
                {query.isLoading
                  ? "Erscheinungsdaten werden geladen …"
                  : "Keine Erscheinungsdaten verfügbar."}
              </Text>
            )}
          </View>
          <UISwitch
            label="Specials anzeigen"
            onValueChange={(showSpecials) => {
              setFilterDraft((currentDraft) => ({
                ...currentDraft,
                showSpecials,
              }));
            }}
            value={filterDraft.showSpecials}
          />
        </View>

        <View className="mt-24 items-center">
          <UIButton label="Zurücksetzen" onPress={reset} size="regular" />
        </View>
      </ScrollView>
    </>
  );
}

function dateOnlyToDate(value: string) {
  const date = parseDateOnly(value);
  if (!date) {
    throw new RangeError(`Invalid date-only value: ${value}`);
  }

  return date;
}

function DatePickerRow({
  label,
  maximumDate,
  minimumDate,
  onValueChange,
  value,
}: {
  label: string;
  maximumDate: Date;
  minimumDate: Date;
  onValueChange: (date: Date) => void;
  value: Date;
}) {
  const [isAndroidPickerOpen, setIsAndroidPickerOpen] = useState(false);
  const valueDateOnly = dateToDateOnly(value);
  const formattedValue = formatReleaseDate(valueDateOnly);

  function commitWebDate(inputValue: string) {
    const date = parseDateOnly(inputValue);
    if (!date) {
      return;
    }

    const dateValue = dateToDateOnly(date);
    if (
      dateValue >= dateToDateOnly(minimumDate) &&
      dateValue <= dateToDateOnly(maximumDate)
    ) {
      onValueChange(date);
    }
  }

  return (
    <View className="flex-row items-center justify-between gap-4">
      <Text>{label}</Text>
      {Platform.OS === "ios" ? (
        <DateTimePicker
          display="compact"
          locale="de_DE"
          maximumDate={maximumDate}
          minimumDate={minimumDate}
          mode="date"
          onValueChange={(_event, date) => {
            onValueChange(date);
          }}
          value={value}
        />
      ) : Platform.OS === "android" ? (
        <>
          <Pressable
            accessibilityLabel={`${label}: ${formattedValue}`}
            accessibilityRole="button"
            className="rounded-lg px-3 py-2"
            onPress={() => {
              setIsAndroidPickerOpen(true);
            }}
          >
            <Text>{formattedValue}</Text>
          </Pressable>
          {isAndroidPickerOpen ? (
            <DateTimePicker
              maximumDate={maximumDate}
              minimumDate={minimumDate}
              mode="date"
              negativeButton={{ label: "Abbrechen" }}
              onDismiss={() => {
                setIsAndroidPickerOpen(false);
              }}
              onValueChange={(_event, date) => {
                onValueChange(date);
                setIsAndroidPickerOpen(false);
              }}
              positiveButton={{ label: "Auswählen" }}
              presentation="dialog"
              value={value}
            />
          ) : null}
        </>
      ) : (
        <TextInput
          accessibilityLabel={`${label}, Datum im Format Jahr-Monat-Tag`}
          className="min-w-32 rounded-lg border border-neutral-300 px-3 py-2 text-right"
          defaultValue={valueDateOnly}
          key={valueDateOnly}
          keyboardType="numbers-and-punctuation"
          onEndEditing={(event) => {
            commitWebDate(event.nativeEvent.text);
          }}
          onSubmitEditing={(event) => {
            commitWebDate(event.nativeEvent.text);
          }}
          placeholder="JJJJ-MM-TT"
        />
      )}
    </View>
  );
}

function dateToDateOnly(date: Date) {
  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDateOnly(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}
