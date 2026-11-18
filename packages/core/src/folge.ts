export function formatFolgenSubtitle(number?: null | number) {
  const base = `Die drei ???`;

  if (number) {
    return `${base} Folge: ${String(number)}`;
  }

  return base;
}
