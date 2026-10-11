import type { FolgeWithCommunityRating } from "@ddfdb/core";

export interface Folge {
  _id: string;
  created_at: string;
  deezer_id?: string; // Can be empty string
  images: {
    height: number;
    url: string;
    width: number;
  }[];
  inhalt: string; // Can be empty string
  isHidden: false;
  name: string;
  number: string; // Can be empty string
  number_of_ratings: number;
  popularity: number;
  rating: number;
  release_date: string;
  spotify_id: string;
  sprecher: string; // Can be empty string
  type: "regular" | "special";
  upc: string; // Can be empty string
  updated_at: string;
  weblink: string; // Can be empty string
}

export function buildLegacyFolge(folge: FolgeWithCommunityRating): Folge {
  const deezer_id = folge.streaming.deezer?.id ?? "";
  const spotify_id = folge.streaming.spotify?.id ?? "";
  const weblink = folge.weblink ?? "";

  return {
    _id: "", // this should be mongo id
    created_at: "", // should come from mongo
    deezer_id,
    images: [], // TBD
    inhalt: folge.description ?? "",
    isHidden: false,
    name: folge.title,
    number: String(folge.number ?? ""),
    number_of_ratings: folge.communityRating?.numberOfRatings ?? 0,
    popularity: 0, // TBD
    rating: folge.communityRating?.score ?? 0,
    release_date: folge.release_date ?? "",
    spotify_id,
    sprecher: folge.voice_roles
      .map(({ role, speaker }) => `${role} - ${speaker}`)
      .join(", "),
    type: folge.collection === "serie" ? "regular" : "special",
    upc: "", // TBD
    updated_at: "", // should come from mongo
    weblink,
  };
}
