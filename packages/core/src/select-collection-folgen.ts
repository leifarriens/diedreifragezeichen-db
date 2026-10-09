/**
 * Selects archive episodes whose IDs appear in a user collection.
 *
 * The returned episodes retain their order from `folgen`.
 */
export function selectCollectionFolgen<T extends { id: number }>(
  folgen: T[],
  collection: { folgeId: number }[],
): T[] {
  const bookmarkedFolgeIds = new Set(collection.map((entry) => entry.folgeId));

  return folgen.filter((folge) => bookmarkedFolgeIds.has(folge.id));
}
