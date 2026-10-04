import type { ImageProps } from "expo-image";

import { Image } from "expo-image";

interface CoverProps extends ImageProps {
  image: {
    height: number;
    url: string;
    width: number;
  };
}

export function Cover({ image }: CoverProps) {
  return (
    <Image
      cachePolicy="disk"
      source={{ uri: image.url }}
      style={{
        aspectRatio: image.width / image.height,
        borderRadius: 14,
        width: "100%",
      }}
    />
  );
}
