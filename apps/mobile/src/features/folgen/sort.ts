export type SortOption = "dateAsc" | "dateDesc" | "popularity" | "rating";

export const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: "Neuste", value: "dateDesc" },
  { label: "Älteste", value: "dateAsc" },
  // { label: "Beste", value: "rating" },
  // { label: "Beliebteste", value: "popularity" },
];
