import type { Folge } from "../../api/types";

export type CollectionSortOption = "addedAtAsc" | "addedAtDesc" | SortOption;
export type SortOption = "dateAsc" | "dateDesc";

export const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: "Neuste", value: "dateDesc" },
  { label: "Älteste", value: "dateAsc" },
];

export const COLLECTION_SORT_OPTIONS: {
  label: string;
  value: CollectionSortOption;
}[] = [
  ...SORT_OPTIONS,
  { label: "Zuletzt hinzugefügt", value: "addedAtDesc" },
  { label: "Zuerst hinzugefügt", value: "addedAtAsc" },
];

export function sortFolgenByAddedAt<T extends Pick<Folge, "id">>(
  folgen: readonly T[],
  addedAtById: ReadonlyMap<string, number>,
  direction: -1 | 1,
): T[] {
  return [...folgen].sort((a, b) => {
    const aAddedAt = addedAtById.get(String(a.id));
    const bAddedAt = addedAtById.get(String(b.id));

    if (aAddedAt === undefined) return bAddedAt === undefined ? 0 : 1;
    if (bAddedAt === undefined) return -1;

    return (aAddedAt - bAddedAt) * direction;
  });
}
