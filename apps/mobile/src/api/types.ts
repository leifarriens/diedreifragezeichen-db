import type { Folge } from "@ddfdb/archiv/contracts";
import type { CommunityRating } from "@ddfdb/user-api";

export interface FolgeWithCommunityRating extends Folge {
  communityRating: null | Omit<CommunityRating, "folgeId">;
}
