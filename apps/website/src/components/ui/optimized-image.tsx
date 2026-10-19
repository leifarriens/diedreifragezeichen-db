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
  const [hasOpimizationFailed, setHasOpimizationFailed] = useState(false);
  function handleError(e: SyntheticEvent<HTMLImageElement>) {
    setHasOpimizationFailed(true);
    onError?.(e);
  }

  return (
    <Image
      alt={alt}
      height={size}
      onError={handleError}
      src={hasOpimizationFailed ? src : buildOptimizationUrl(src, size)}
      unoptimized // Disables Next.js's built-in image optimization
      width={size}
      {...rest}
    />
  );
}
