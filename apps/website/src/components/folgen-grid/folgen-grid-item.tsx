import type { Folge } from "@ddfdb/archiv/contracts";

import { formatReleaseDate } from "@ddfdb/core";
import Link from "next/link";
import { memo, useRef, useState } from "react";
import { cn } from "tailwind-variants";

import { useIntersectionObserver } from "@/lib/hooks/use-intersection-observer";

import styles from "./folgen-grid-item.module.css";

interface FolgenGridItemProps {
  folge: Folge;
  // rating?: number;
  userRating: number | undefined;
}

export const FolgenGridItem = memo(function FolgenGridItem({
  folge,
  userRating,
}: FolgenGridItemProps) {
  const href = `/folge/${folge.id.toString()}`;

  return (
    <article
      className={cn(
        styles.container,
        "relative w-full overflow-hidden rounded-xl bg-cover",
      )}
    >
      <Link aria-label={folge.title} href={href}>
        <Cover
          artwork={folge.artwork}
          cover={folge.cover}
          title={folge.title}
        />
      </Link>

      <div className="flex items-center justify-between px-3 py-2 text-sm">
        <div>
          <div>
            <span className="text-xl font-medium">???</span>
            /10
          </div>
          {folge.release_date && (
            <div className="text-xs font-extralight text-neutral-200">
              {formatReleaseDate(folge.release_date)}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {userRating !== undefined && <div>{userRating / 2}/3</div>}
          <div>List</div>
        </div>
      </div>
    </article>
  );
});

type CoverProps = Pick<Folge, "artwork" | "cover" | "title">;

function Cover({ artwork, cover, title }: CoverProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useIntersectionObserver(ref);
  const [isLoaded, setIsLoaded] = useState(false);

  if (!cover) {
    return null;
  }

  const alt = `${title} Cover`;

  return (
    <div ref={ref}>
      <div className={styles.background} />
      <div
        className={cn(styles.overlay, "absolute inset-0 -z-10")}
        style={{
          ...(isLoaded && { backgroundImage: `url(${artwork ?? cover})` }),
        }}
      />
      <div className="aspect-square h-auto w-full overflow-hidden">
        {isInView && (
          <img
            alt={alt}
            className="shadow-lg transition-all duration-150 ease-in"
            onLoad={() => {
              setIsLoaded(true);
            }}
            src={cover}
            style={{
              opacity: !isLoaded ? 0 : 1,
              visibility: !isLoaded ? "hidden" : "visible",
            }}
          />
        )}
      </div>
    </div>
  );
}
