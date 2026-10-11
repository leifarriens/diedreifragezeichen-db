export interface ListenedFolge {
  createdAt: string;
  folgeId: number;
}

export interface ListenedRepository {
  findListenedFolgenByUserId(input: { userId: string }): Promise<ListenedFolge[]>;
  markFolgeAsListened(input: {
    folgeId: number;
    userId: string;
  }): Promise<ListenedFolge>;
  markFolgeAsNotListened(input: {
    folgeId: number;
    userId: string;
  }): Promise<void>;
}
