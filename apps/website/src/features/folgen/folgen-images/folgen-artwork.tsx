import { OptimizedImage, type OptimizedImageProps } from "./optimized-image";

interface FolgenBackgroundProps extends Omit<
  OptimizedImageProps,
  "alt" | "size" | "src"
> {
  artworkUrl: string;
}

export function FolgenBackground({
  artworkUrl,
  ...rest
}: FolgenBackgroundProps) {
  return (
    <OptimizedImage
      alt="" // Decorative image, no alt text needed
      loading="lazy"
      size={64}
      src={artworkUrl}
      {...rest}
    />
  );
}
