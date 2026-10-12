export function normalizeSearchQuery(query: string): string {
  return query.trim().toLocaleLowerCase("de-DE");
}
