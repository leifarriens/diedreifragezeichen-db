export function formatFolgenSubtitle(number?: null | number) {
  return `Die drei ??? ${number ? `Folge: ${String(number)}` : ""}`;
}
