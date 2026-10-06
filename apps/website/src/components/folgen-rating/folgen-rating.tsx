import type { CommunityRating } from "@ddfdb/user-api";

interface FolgenRatingProps {
  communityRating: null | Omit<CommunityRating, "folgeId">;
  title: string;
}

export function FolgenRating({ communityRating, title }: FolgenRatingProps) {
  if (!communityRating) {
    return <div className="h-5" />;
  }

  const { score } = communityRating;

  const full = Math.floor(score);
  const half = score - full >= 0.5;
  const empty = 3 - full - (half ? 1 : 0);

  return (
    <div
      aria-label={`${title} hat eine Bewertung von ${score.toString()} von 3`}
      className="flex h-5 gap-x-[1px]"
    >
      {Array.from({ length: full }).map((_, index) => (
        <span key={`full-${index.toString()}`}>
          <img className="h-full" src="/blue_small.png" />
        </span>
      ))}
      {half && (
        <span>
          <img className="h-full" src="/blue_small_half.png" />
        </span>
      )}
      {Array.from({ length: empty }).map((_, index) => (
        <span key={`empty-${index.toString()}`}>
          <img className="h-full" src="/white_small.png" />
        </span>
      ))}
    </div>
  );
}
