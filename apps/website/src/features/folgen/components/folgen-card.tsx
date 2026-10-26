import type { FolgenListItemWithUserData } from "@ddfdb/client";

import { formatReleaseDate } from "@ddfdb/core";
import Link from "next/link";
import { memo, useRef } from "react";
import { cn } from "tailwind-variants";

import { FolgenBookmarkButton } from "@/features/bookmarks/folgen-bookmark-button";
import { FolgenListenedButton } from "@/features/listened/folgen-listened-button";
import { FolgenRatingDisplay } from "@/features/ratings/components/folgen-rating-display";

import { useIntersectionObserver } from "../hooks/use-intersection-observer";
import { FolgenBackground } from "./folgen-artwork";
import styles from "./folgen-card.module.css";
import { FolgenCover, type FolgenCoverProps } from "./folgen-cover";

export interface FolgenCardProps {
  coverLoading: FolgenCoverProps["loading"];
  folge: FolgenListItemWithUserData;
}

export const FolgenCard = memo(function FolgenGridItem({
  coverLoading,
  folge,
}: FolgenCardProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useIntersectionObserver(ref);

  const {
    artwork,
    collection,
    communityRating,
    cover,
    hasListened,
    id,
    isBookmarked,
    releaseDate,
    title,
    userRating,
  } = folge;

  const href = `/folge/${id.toString()}`;

  const ariaLabel =
    collection === "specials" ? `Special: ${title}` : `Folge: ${title}`;

  return (
    <article
      className={cn(
        styles.container,
        "group relative w-full overflow-hidden rounded-xl bg-cover transition-transform duration-150 ease-out hover:z-10 hover:scale-[1.2] hover:shadow-2xl",
      )}
      ref={ref}
    >
      <Link
        aria-label={ariaLabel}
        href={href}
        prefetch={false} // Prevent unnecessary auto prefetching on grid views
      >
        <FolgenCover
          className="aspect-square rounded-xl group-hover:rounded-b-none"
          coverUrl={cover}
          folgenTitle={title}
          isInView={isInView}
          loading={coverLoading}
        />
      </Link>

      <div className="flex items-center justify-between px-3 py-2 text-sm">
        <div>
          <FolgenRatingDisplay
            className="h-5"
            folgenTitle={title}
            type="community"
            value={communityRating?.score ?? null}
          />

          {releaseDate && (
            <div className="text-xs font-extralight text-neutral-200">
              {formatReleaseDate(releaseDate)}
            </div>
          )}
        </div>

        {isInView && (
          <div className="flex items-center gap-0.5">
            {userRating !== null && (
              <FolgenRatingDisplay
                folgenTitle={title}
                type="user"
                value={userRating}
              />
            )}

            <FolgenBookmarkButton
              folgeId={id}
              folgeTitle={title}
              isBookmarked={isBookmarked}
              size={24}
            />

            <FolgenListenedButton
              folgeId={id}
              folgeTitle={title}
              hasListened={hasListened}
              size={24}
            />
          </div>
        )}
      </div>

      <Background imageUrl={artwork ?? cover} />
    </article>
  );
});

function Background({ imageUrl }: { imageUrl: null | string }) {
  return (
    <>
      {imageUrl && (
        <div
          className={cn(
            styles.overlay,
            "absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100",
          )}
        >
          <FolgenBackground
            artworkUrl={imageUrl}
            className="aspect-square w-full"
            fetchPriority="low"
            loading="lazy"
          />
        </div>
      )}
      <div className="absolute inset-0 -z-20 bg-[#000e18] opacity-0 transition-opacity duration-150 ease-out group-hover:opacity-100" />
    </>
  );
}
