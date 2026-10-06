import type { Folge } from "@ddfdb/archiv/contracts";
import type { CommunityRating } from "@ddfdb/user-api";

// DISCUSS: Should this become the default `Folge` type?
export interface FolgeWithCommunityRating extends Folge {
  communityRating: null | Omit<CommunityRating, "folgeId">;
}

export interface FolgeWithUserRating extends Folge {
  userRating: null | number;
  userRatingUpdatedAt: null | string;
}
