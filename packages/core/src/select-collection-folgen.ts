/**
 * Selects archive episodes in the same order as the user collection.
 */
export function selectCollectionFolgen<T extends { id: number }>(
  folgen: T[],
  collection: { folgeId: number }[],
  limit?: number,
): T[] {
  const folgenById = new Map(folgen.map((folge) => [folge.id, folge]));

  const selectedFolgen = collection.flatMap(({ folgeId }) => {
    const folge = folgenById.get(folgeId);
    return folge === undefined ? [] : [folge];
  });

  return limit === undefined ? selectedFolgen : selectedFolgen.slice(0, limit);
}
