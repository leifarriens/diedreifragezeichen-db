import type { ReactNode } from "react";

export interface FolgenGridContextMenuProps {
  children: ReactNode;
  folgeId: number;
  folgenTitle: string;
  hasListened: boolean;
  isBookmarked: boolean;
  userRating: null | number;
}
