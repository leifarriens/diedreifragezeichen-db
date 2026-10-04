import type { ReactNode } from "react";

import { Image, type ImageProps, useImage } from "expo-image";
import { View } from "react-native";

export interface AsyncImageProps extends Omit<
  ImageProps,
  "placeholder" | "source"
> {
  placeholder?: ReactNode;
  uri: string;
}

export function AsyncImage({ placeholder, uri, ...rest }: AsyncImageProps) {
  const imageRef = useImage({ uri });

  if (!imageRef) {
    return placeholder ?? <View />;
  }

  return <Image source={imageRef} {...rest} />;
}
