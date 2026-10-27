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
  const optimizedUri = getImageUrl(imageUrl, imageSize);
  const [source, setSource] = useState({
    isLoaded: false,
    optimizedUri,
    uri: optimizedUri,
  });

  // Recycled rows must reset their source and fallback state before rendering.
  let currentSource = source;
  if (source.optimizedUri !== optimizedUri) {
    currentSource = { isLoaded: false, optimizedUri, uri: optimizedUri };
    setSource(currentSource);
  }

  const { isLoaded, uri } = currentSource;

  function handleError(event: ImageErrorEventData) {
    if (event.error) {
      // Ignore errors from a previous request after the view has been recycled.
      setSource((current) =>
        current.optimizedUri === optimizedUri && current.uri === uri
          ? { ...current, isLoaded: false, uri: imageUrl }
          : current,
      );
    }

    onError?.(event);
  }

  function handleLoad(event: ImageLoadEventData) {
    setSource((current) =>
      current.optimizedUri === optimizedUri && current.uri === uri
        ? { ...current, isLoaded: true }
        : current,
    );

    onLoad?.(event);
  }

  return (
    <View className={className ?? ""} style={[{ overflow: "hidden" }, style]}>
      {isLoaded ? null : placeholder}
      <Image
        onError={handleError}
        onLoad={handleLoad}
        recyclingKey={uri}
        source={{
          cacheKey: `${String(imageSize)}:${uri}`,
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
