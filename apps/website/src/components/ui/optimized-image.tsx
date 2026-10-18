import {
  buildOptimizationUrl,
  type ImageSize,
} from "@ddfdb/image-optimization";
import Image, { type ImageProps } from "next/image";

export interface OptimizedImageProps extends Omit<
  ImageProps,
  "height" | "src" | "unoptimized" | "width"
> {
  size: ImageSize;
  src: string;
}

export function OptimizedImage({
  alt,
  size,
  src,
  ...rest
}: OptimizedImageProps) {
  return (
    <Image
      alt={alt}
      height={size}
      src={buildOptimizationUrl(src, size)}
      unoptimized // Disables Next.js's built-in image optimization
      width={size}
      {...rest}
    />
  );
}
