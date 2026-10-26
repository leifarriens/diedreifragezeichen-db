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
  const [imageSrc, setImageSrc] = useState(() =>
    buildOptimizationUrl(src, size),
  );

  function handleError(e: SyntheticEvent<HTMLImageElement>) {
    setImageSrc(src);
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
