import Image, { type ImageProps } from "next/image";

interface FolgenCoverProps extends Omit<
  ImageProps,
  "alt" | "height" | "quality" | "src" | "width"
> {
  coverUrl: string;
  folgenTitle: string;
}

export function FolgenCover({
  className,
  coverUrl,
  folgenTitle,
  ...rest
}: FolgenCoverProps) {
  const alt = `${folgenTitle} Cover`;

  return (
    <Image
      alt={alt}
      className={className}
      height={512}
      src={coverUrl}
      width={512}
      {...rest}
    />
  );
}
