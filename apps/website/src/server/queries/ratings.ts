import { cacheLife, cacheTag } from "next/cache";

import { ratingRepository } from "../repositories/rating/rating.repository";
import { profile } from "./cache";

export async function getAllCommunityRatings() {
  "use cache";

  cacheLife(profile);

  cacheTag("community-ratings");

  return ratingRepository.findAllCommunityRatings();
}

/**
 * Find a community rating for a specific episode from `getAllCommunityRatings`.
 * This is done instead of using `ratingRepository.findCommunityRatingByFolgeId` directly to share a
 * single cached result across multiple requests.
 */
export async function getCommunityRatingForFolge(folgeId: number) {
  const communityRating = await getAllCommunityRatings();

  const folgeRating = communityRating.find(
    (rating) => rating.folgeId === folgeId,
  );

  if (!folgeRating) {
    return null;
  }

  return folgeRating;
}
