export function getIsMacOS() {
  return /Mac|iPhone|iPad|iPod/.test(navigator.platform);
}

export function normalizeSearchQuery(query: string): string {
  return query.trim().toLocaleLowerCase("de-DE");
}
