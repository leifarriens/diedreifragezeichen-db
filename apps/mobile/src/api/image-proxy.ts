const baseUrl = process.env.EXPO_PUBLIC_DDFDB_API_URL as unknown;

export interface ImageProxyOptions {
  width?: "64" | "512";
}

const NEXT_IMAGE_PATH = "/_next/image";

export function buildImageProxyUrl(
  imageUrl: string,
  { width = "512" }: ImageProxyOptions = {},
) {
  if (!baseUrl || typeof baseUrl !== "string") {
    console.error(
      "EXPO_PUBLIC_DDFDB_API_URL must be configured for image proxy. Falling back to the original image URL.",
    );
    return imageUrl;
  }

  const proxyUrl = new URL(NEXT_IMAGE_PATH, baseUrl);

  proxyUrl.searchParams.set("url", imageUrl);
  proxyUrl.searchParams.set("w", width);
  proxyUrl.searchParams.set("q", "75");

  return proxyUrl.toString();
}
