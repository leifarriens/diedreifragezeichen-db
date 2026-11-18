import type { Folge } from "@ddfdb/archiv/contracts";
import type { CommunityRatingSummary, FolgeUserData } from "@ddfdb/core";

/** Episode data needed for list rendering, client search, and sorting. */
export type FolgeListItem = Pick<
  Folge,
  | "artwork"
  | "authors"
  | "collection"
  | "cover"
  | "id"
  | "number"
  | "releaseDate"
  | "scriptAuthors"
  | "title"
  | "totalDuration"
  | "voiceRoles"
> & {
  communityRating: null | Pick<CommunityRatingSummary, "score">;
};

export type FolgenListItemWithUserData = FolgeListItem & FolgeUserData;
