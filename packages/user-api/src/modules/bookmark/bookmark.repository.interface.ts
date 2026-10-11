export interface Bookmark {
  createdAt: string;
  folgeId: number;
}

export interface BookmarkRepository {
  createBookmark(input: { folgeId: number; userId: string }): Promise<Bookmark>;
  deleteBookmark(input: { folgeId: number; userId: string }): Promise<void>;
  findBookmarksByUserId(input: { userId: string }): Promise<Bookmark[]>;
}
