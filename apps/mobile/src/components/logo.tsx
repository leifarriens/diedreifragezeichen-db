import { Image, type ImageProps } from "expo-image";

import logo from "../../assets/logo.png";

export function Logo({
  contentFit,
  style,
}: Pick<ImageProps, "contentFit" | "style">) {
  return (
    <Image
      cachePolicy="disk"
      contentFit={contentFit ?? "contain"}
      source={logo}
      style={[{ height: 30, width: 80 }, style]}
    />
  );
}
