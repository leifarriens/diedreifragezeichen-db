"use client";

import { useState } from "react";
import { cn } from "tailwind-variants";

import { OptimizedImage, type OptimizedImageProps } from "./optimized-image";

export interface FolgenCoverProps extends Omit<
  OptimizedImageProps,
  "alt" | "size" | "src"
> {
  coverUrl: null | string;
  folgenTitle: string;
  isInView?: boolean;
}

export function FolgenCover({
  className,
  coverUrl,
  folgenTitle,
  isInView = true,
  style,
  ...rest
}: FolgenCoverProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  const alt = `Cover für ${folgenTitle}`;

  if (!coverUrl || isError) {
    return (
      <div
        className={cn(
          "grid aspect-square w-full place-items-center rounded-xl bg-ddf-blue-950 p-4 transition-opacity duration-150 ease-in",
          className,
        )}
      >
        <span className="text-center text-lg font-semibold">{folgenTitle}</span>
      </div>
    );
  }

  return (
    <OptimizedImage
      alt={alt}
      className={cn(
        "w-full rounded-xl object-cover transition-opacity duration-150 ease-in",
        className,
      )}
      onError={() => {
        setIsError(true);
      }}
      onLoad={() => {
        setIsLoaded(true);
      }}
      size={640}
      src={coverUrl}
      style={{
        opacity: !isLoaded || !isInView ? 0 : 1,
        visibility: !isLoaded ? "hidden" : "visible",
        ...style,
      }}
      {...rest}
    />
  );
}
