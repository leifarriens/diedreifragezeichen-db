import { useFolgenWithCommunityRating } from "./use-folgen-with-community-rating";

export function useFolge(folgeId: string) {
  const folgenQuery = useFolgenWithCommunityRating();

  const data = folgenQuery.data?.find((f) => String(f.id) === folgeId);

  return {
    data,
    isError: !!folgenQuery.error || (!folgenQuery.isLoading && !data),
    isLoading: folgenQuery.isLoading,
  };
}
