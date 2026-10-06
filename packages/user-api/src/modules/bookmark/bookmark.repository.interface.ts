export interface Bookmark {
  createdAt: string;
  folgeId: number;
}

export interface BookmarkRepository {
  addBookmark(input: { folgeId: number; userId: string }): Promise<Bookmark>;
  getUserBookmarks(input: { userId: string }): Promise<Bookmark[]>;
  isBookmarked(input: { folgeId: number; userId: string }): Promise<boolean>;
  removeBookmark(input: { folgeId: number; userId: string }): Promise<void>;
}
