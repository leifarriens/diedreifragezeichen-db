import type { Folge } from "@ddfdb/archiv/contracts";
import type { FolgeUserData, FolgeWithCommunityRating } from "@ddfdb/core";

import { formatReleaseDate } from "@ddfdb/core";
import Link from "next/link";
import { memo, useRef, useState } from "react";
import { cn } from "tailwind-variants";

import { FolgenBookmarkButton } from "@/features/bookmarks/folgen-bookmark-button";
import { FolgenListenedButton } from "@/features/listened/folgen-listened-button";
import { FolgenRatingDisplay } from "@/features/ratings/components/folgen-rating-display";

import { FolgenBackground } from "../folgen-images/folgen-artwork";
import {
  FolgenCover,
  type FolgenCoverProps,
} from "../folgen-images/folgen-cover";
import styles from "./folgen-grid-item.module.css";
import { useIntersectionObserver } from "./use-intersection-observer";

export interface FolgenGridItemProps {
  coverLoading: CoverProps["loading"];
  folge: FolgeUserData & FolgeWithCommunityRating;
}

export const FolgenGridItem = memo(function FolgenGridItem({
  coverLoading,
  folge,
}: FolgenGridItemProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useIntersectionObserver(ref, {
    triggerOnce: false,
  });

  const {
    artwork,
    communityRating,
    cover,
    hasListened,
    id,
    isBookmarked,
    release_date,
    title,
    userRating,
  } = folge;

  return (
    <article
      className={cn(
        styles.container,
        "group relative w-full overflow-hidden rounded-xl bg-cover transition-transform duration-150 ease-out hover:z-10 hover:scale-[1.2] hover:shadow-2xl",
      )}
      ref={ref}
    >
      <Link aria-label={title} href={`/folge/${id.toString()}`}>
        <Cover
          cover={cover}
          isInView={isInView}
          loading={coverLoading}
          title={title}
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

          {release_date && (
            <div className="text-xs font-extralight text-neutral-200">
              {formatReleaseDate(release_date)}
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

type CoverProps = Pick<Folge, "cover" | "title"> &
  Pick<FolgenCoverProps, "loading"> & { isInView: boolean };

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
            artwork={imageUrl}
            className="h-full w-full"
            fetchPriority="low"
            loading="lazy"
          />
        </div>
      )}
      <div className="absolute inset-0 -z-20 bg-[#000e18] opacity-0 transition-opacity duration-150 ease-out group-hover:opacity-100" />
    </>
  );
}

function Cover({ cover, isInView, loading = "lazy", title }: CoverProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="aspect-square h-auto w-full overflow-hidden rounded-xl group-hover:rounded-b-none">
      {!cover ? (
        <div className="grid h-full place-items-center bg-[#000b0f]" />
      ) : (
        <FolgenCover
          className="transition-opacity duration-150 ease-in"
          coverUrl={cover}
          folgenTitle={title}
          loading={loading}
          onLoad={() => {
            setIsLoaded(true);
          }}
          style={{
            opacity: !isLoaded || !isInView ? 0 : 1,
            visibility: !isLoaded ? "hidden" : "visible",
          }}
        />
      )}
    </div>
  );
}
