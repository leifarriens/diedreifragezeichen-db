import "dayjs/locale/de";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.locale("de");

export const DATE_FORMAT = "DD.MM.YYYY";

export function formatDateOnly(date: Date | string): string {
  return dayjs(date).format("YYYY-MM-DD");
}

export function formatRelativeTime(date: Date | string): string {
  return dayjs(date).fromNow();
}

export function formatReleaseDate(date: Date | string): string {
  return dayjs(date).format(DATE_FORMAT);
}

export function getDateTimestamp(date: Date | null | string): number {
  return date === null ? Number.NaN : dayjs(date).valueOf();
}

export function getDateYear(date: Date | string): number {
  return dayjs(date).year();
}

export function isDateBefore(
  date: Date | string,
  other: Date | string,
): boolean {
  return dayjs(date).isBefore(dayjs(other));
}

export function isDateWithinRange(
  date: Date | string,
  startDate: Date | null | string,
  endDate: Date | null | string,
): boolean {
  const parsedDate = dayjs(date);

  return (
    parsedDate.isValid() &&
    (startDate === null || parsedDate.isSameOrAfter(dayjs(startDate), "day")) &&
    (endDate === null || parsedDate.isSameOrBefore(dayjs(endDate), "day"))
  );
}

export function isReleasDateInThePast(date: Date | null | string): boolean {
  if (!date) {
    return false;
  }

  return dayjs(date).isSameOrBefore(dayjs(), "day");
}

export function isValidDate(date: Date | string): boolean {
  return dayjs(date).isValid();
}
