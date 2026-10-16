import {
  buildOptimizationUrl,
  type ImageSize,
} from "@ddfdb/image-optimization";
import {
  Image,
  type ImageErrorEventData,
  type ImageLoadEventData,
  type ImageProps,
} from "expo-image";
import { useState } from "react";
import { StyleSheet, View, type ViewProps } from "react-native";

interface OptimizedImageProps
  extends
    Omit<ImageProps, "className" | "placeholder" | "source" | "style">,
    Pick<ViewProps, "className" | "style"> {
  imageSize: ImageSize;
  imageUrl: string;
  placeholder?: React.ReactNode;
}

const imageBaseUrl = process.env.EXPO_PUBLIC_DDFDB_API_URL as unknown;

export function OptimizedImage({
  className,
  imageSize,
  imageUrl,
  onError,
  onLoad,
  placeholder,
  style,
  ...imageProps
}: OptimizedImageProps) {
  const [uri, setUri] = useState(() => getImageUrl(imageUrl, imageSize));
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

function getImageUrl(imageUrl: string, imageSize: ImageSize) {
  if (!imageBaseUrl || typeof imageBaseUrl !== "string") {
    console.error(
      "EXPO_PUBLIC_DDFDB_API_URL must be configured for image proxy. Falling back to the original image URL.",
    );

    return imageUrl;
  }

  return buildOptimizationUrl(imageUrl, imageSize, imageBaseUrl);
}
