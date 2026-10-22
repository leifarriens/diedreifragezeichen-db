import {
  OptimizedImage,
  type OptimizedImageProps,
} from "../../../components/ui/optimized-image";

interface FolgenBackgroundProps extends Omit<
  OptimizedImageProps,
  "alt" | "size" | "src"
> {
  artworkUrl: string;
}

export function FolgenBackground({
  artworkUrl,
  loading = "lazy",
  ...rest
}: FolgenBackgroundProps) {
  return (
    <OptimizedImage
      alt="" // Decorative image, no alt text needed
      loading={loading}
      size={64}
      src={artworkUrl}
      {...rest}
    />
  );
}
