import Image, { type ImageProps } from "next/image";

interface FolgenBackgroundProps extends Omit<
  ImageProps,
  "alt" | "fill" | "height" | "quality" | "src" | "width"
> {
  artwork: string;
}

export function FolgenBackground({ artwork, ...rest }: FolgenBackgroundProps) {
  return <Image alt="" height={64} src={artwork} width={64} {...rest} />;
}
