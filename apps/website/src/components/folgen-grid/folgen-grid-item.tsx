import type { Folge } from "@ddfdb/archiv/contracts";

import { formatReleaseDate } from "@ddfdb/core";
import Link from "next/link";
import { memo, useRef, useState } from "react";
import { cn } from "tailwind-variants";

import type { FolgeWithCommunityRating } from "@/lib/types";

import { useIntersectionObserver } from "@/lib/hooks/use-intersection-observer";

import { FolgenRating } from "../folgen-rating/folgen-rating";
import styles from "./folgen-grid-item.module.css";

interface FolgenGridItemProps {
  folge: FolgeWithCommunityRating;
  isBookmarked: boolean;
  userRating: null | number;
}

export const FolgenGridItem = memo(function FolgenGridItem({
  folge,
  isBookmarked,
  userRating,
}: FolgenGridItemProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useIntersectionObserver(ref, {
    triggerOnce: true,
  });

  return (
    <article
      className={cn(
        styles.container,
        "group relative w-full overflow-hidden rounded-xl bg-cover transition-transform duration-150 ease-out hover:z-10 hover:scale-[1.2] hover:shadow-2xl",
      )}
      ref={ref}
    >
      <Link aria-label={folge.title} href={`/folge/${folge.id.toString()}`}>
        <Cover cover={folge.cover} shouldLoad={isInView} title={folge.title} />
      </Link>

      <div className="flex items-center justify-between px-3 py-2 text-sm">
        <div>
          {folge.communityRating ? (
            <FolgenRating
              communityRating={folge.communityRating}
              title={folge.title}
            />
          ) : (
            <div />
          )}

          {folge.release_date && (
            <div className="text-xs font-extralight text-neutral-200">
              {formatReleaseDate(folge.release_date)}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {userRating !== null && <div>{userRating}/3</div>}
          <div>{isBookmarked ? "Bookmarked" : "Not Bookmarked"}</div>
        </div>
      </div>

      <Background
        imageUrl={folge.artwork ?? folge.cover}
        shouldLoad={isInView}
      />
    </article>
  );
});

interface CoverProps extends Pick<Folge, "cover" | "title"> {
  shouldLoad: boolean;
}

function Background({
  imageUrl,
  shouldLoad,
}: {
  imageUrl: null | string;
  shouldLoad: boolean;
}) {
  return (
    <>
      {imageUrl && (
        <div
          className={cn(
            styles.overlay,
            "absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100",
          )}
          style={{
            ...(shouldLoad && { backgroundImage: `url(${imageUrl})` }),
          }}
        />
      )}
      <div className="absolute inset-0 -z-20 bg-[#000e18] opacity-0 transition-opacity duration-150 ease-out group-hover:opacity-100" />
    </>
  );
}

function Cover({ cover, shouldLoad, title }: CoverProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  const alt = `${title} Cover`;

  return (
    <div className="aspect-square h-auto w-full overflow-hidden rounded-xl group-hover:rounded-b-none">
      {!cover ? (
        <div className="grid h-full place-items-center bg-[#000b0f]" />
      ) : shouldLoad ? (
        <img
          alt={alt}
          className="shadow-lg transition-opacity duration-150 ease-in"
          onLoad={() => {
            setIsLoaded(true);
          }}
          src={cover}
          style={{
            opacity: !isLoaded ? 0 : 1,
            visibility: !isLoaded ? "hidden" : "visible",
          }}
        />
      ) : null}
    </div>
  );
}
