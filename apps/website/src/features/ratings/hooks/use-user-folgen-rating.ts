import { useUserRatings } from "./use-ratings";

export function useUserFolgenRating(folgeId: number) {
  const { data: userRatings } = useUserRatings();

  return userRatings?.find((rating) => rating.folgeId === folgeId);
}
