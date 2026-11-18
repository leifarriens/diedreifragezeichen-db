export interface EnrichFolgenWithUserDataInput {
  bookmarks?: readonly FolgeBookmarkData[] | undefined;
  listened?: readonly FolgeListenedData[] | undefined;
  ratings?: readonly FolgeRatingData[] | undefined;
}

export interface FolgeUserData {
  bookmarkedAt: null | string;
  hasListened: boolean;
  isBookmarked: boolean;
  listenedAt: null | string;
  userRating: null | number;
  userRatingUpdatedAt: null | string;
}

interface FolgeBookmarkData {
  createdAt: string;
  folgeId: number;
}

interface FolgeListenedData {
  createdAt: string;
  folgeId: number;
}

interface FolgeRatingData {
  folgeId: number;
  score: number;
  updatedAt: string;
}

/**
 * Adds a user's bookmark, listening, and rating data to each Folge.
 *
 * Episodes without matching user data receive null timestamps and ratings,
 * and false boolean flags. The input arrays and Folge objects are not mutated.
 */
export function enrichFolgenWithUserData<T extends { id: number }>(
  folgen: readonly T[],
  {
    bookmarks = [],
    listened = [],
    ratings = [],
  }: EnrichFolgenWithUserDataInput = {},
): (FolgeUserData & T)[] {
  if (folgen.length === 0) {
    return [];
  }

  const bookmarksByFolgeId = new Map(
    bookmarks.map(({ createdAt, folgeId }) => [folgeId, createdAt] as const),
  );
  const listenedByFolgeId = new Map(
    listened.map(({ createdAt, folgeId }) => [folgeId, createdAt] as const),
  );
  const ratingsByFolgeId = new Map(
    ratings.map((rating) => [rating.folgeId, rating] as const),
  );

  return folgen.map((folge) => {
    const bookmarkedAt = bookmarksByFolgeId.get(folge.id);
    const listenedAt = listenedByFolgeId.get(folge.id);
    const userRating = ratingsByFolgeId.get(folge.id);

    return {
      ...folge,
      bookmarkedAt: bookmarkedAt ?? null,
      hasListened: Boolean(listenedAt),
      isBookmarked: Boolean(bookmarkedAt),
      listenedAt: listenedAt ?? null,
      userRating: userRating?.score ?? null,
      userRatingUpdatedAt: userRating?.updatedAt ?? null,
    };
  });
}
