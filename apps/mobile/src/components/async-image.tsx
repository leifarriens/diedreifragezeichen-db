import { Image, type ImageProps } from "expo-image";
import { type ReactNode, useState } from "react";
import { StyleSheet, View } from "react-native";

export interface AsyncImageProps extends Omit<
  ImageProps,
  "placeholder" | "source"
> {
  placeholder?: ReactNode;
  uri: string;
}

export function AsyncImage({
  onLoad,
  placeholder,
  style,
  uri,
  ...rest
}: AsyncImageProps) {
  const [loadedUri, setLoadedUri] = useState<null | string>(null);
  const isLoaded = loadedUri === uri;

  // FlashList recycles rows, so keep the source as a URI instead of passing a
  // disposable native ImageRef from useImage through recycled props.
  return (
    <View style={[style, { overflow: "hidden" }]}>
      {isLoaded ? null : placeholder}
      <Image
        {...rest}
        onLoad={(event) => {
          if (event.source.url === uri) {
            setLoadedUri(uri);
          }
          onLoad?.(event);
        }}
        source={{ uri }}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
}
