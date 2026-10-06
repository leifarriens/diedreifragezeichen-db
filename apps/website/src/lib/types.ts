import type { Folge } from "@ddfdb/archiv/contracts";

export interface FolgeWithUserRating extends Folge {
  userRating?: number;
}
