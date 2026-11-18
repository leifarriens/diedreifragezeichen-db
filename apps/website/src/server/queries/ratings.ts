import { cacheLife, cacheTag } from "next/cache";

import { ratingRepository } from "../repositories/rating/rating.repository";
import { profile } from "./cache";

export async function getAllCommunityRatings() {
  "use cache";

  cacheLife(profile);

  cacheTag("community-ratings");

  return ratingRepository.findAllFolgenCommunityRatings();
}
