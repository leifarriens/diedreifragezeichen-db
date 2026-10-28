"use client";

import {
  buildOptimizationUrl,
  type ImageSize,
} from "@ddfdb/image-optimization";
import Image, { type ImageProps } from "next/image";
import { type SyntheticEvent, useState } from "react";

export interface OptimizedImageProps extends Omit<
  ImageProps,
  "height" | "src" | "unoptimized" | "width"
> {
  size: ImageSize;
  src: string;
}

export function OptimizedImage({
  alt,
  onError,
  size,
  src,
  ...rest
}: OptimizedImageProps) {
  const optimizedSrc = buildOptimizationUrl(src, size);
  const [failedOptimizedSrc, setFailedOptimizedSrc] = useState<null | string>(
    null,
  );
  const imageSrc = failedOptimizedSrc === optimizedSrc ? src : optimizedSrc;

  function handleError(e: SyntheticEvent<HTMLImageElement>) {
    if (imageSrc !== src) {
      setFailedOptimizedSrc(optimizedSrc);
      return;
    }

    // Only report a terminal failure so consumers keep the image mounted
    // while the original source is loading.
    onError?.(e);
  }

  return (
    <Image
      alt={alt}
      height={size}
      onError={handleError}
      src={imageSrc}
      unoptimized // Disables Next.js's built-in image optimization
      width={size}
      {...rest}
    />
  );
}
