export interface ListenedFolge {
  createdAt: string;
  folgeId: number;
}

export interface ListenedRepository {
  addListened(input: {
    folgeId: number;
    userId: string;
  }): Promise<ListenedFolge>;
  getUserListened(input: { userId: string }): Promise<ListenedFolge[]>;
  removeListened(input: { folgeId: number; userId: string }): Promise<void>;
}
