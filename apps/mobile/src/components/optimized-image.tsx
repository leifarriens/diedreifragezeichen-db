import {
  Image,
  type ImageErrorEventData,
  type ImageLoadEventData,
  type ImageProps,
} from "expo-image";
import { useState } from "react";
import { StyleSheet, View, type ViewProps } from "react-native";

import { buildImageProxyUrl, type ImageProxyOptions } from "@/api/image-proxy";

interface OptimizedImageProps
  extends
    Omit<ImageProps, "className" | "placeholder" | "source" | "style">,
    Pick<ViewProps, "className" | "style"> {
  imageUrl: string;
  optimizationOptions?: ImageProxyOptions;
  placeholder?: React.ReactNode;
}

export function OptimizedImage({
  className,
  imageUrl,
  onError,
  onLoad,
  optimizationOptions,
  placeholder,
  style,
  ...imageProps
}: OptimizedImageProps) {
  const [uri, setUri] = useState(() =>
    buildImageProxyUrl(imageUrl, {
      width: optimizationOptions?.width ?? "512",
    }),
  );
  const [loadedUri, setLoadedUri] = useState<null | string>(null);
  const isLoaded = loadedUri === uri;

  function handleError(event: ImageErrorEventData) {
    if (event.error) {
      // If the optimized image fails to load, fallback to the original image URL.
      setUri(imageUrl);
    }

    onError?.(event);
  }

  function handleLoad(event: ImageLoadEventData) {
    if (event.source.url) {
      setLoadedUri(event.source.url);
    }

    onLoad?.(event);
  }

  return (
    <View
      className={className ?? ""}
      style={[
        {
          // Ensure border radius is applied correctly
          overflow: "hidden",
        },
        style,
      ]}
    >
      {isLoaded ? null : placeholder}
      <Image
        onError={handleError}
        onLoad={handleLoad}
        source={{
          cacheKey: imageUrl,
          uri,
        }}
        style={StyleSheet.absoluteFill}
        {...imageProps}
      />
    </View>
  );
}
