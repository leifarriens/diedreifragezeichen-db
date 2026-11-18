const IMAGE_QUALITY = 85;

export type ImageSize = (typeof IMAGE_SIZES)[number];

const IMAGE_SIZES = [64, 640] as const;

const NEXT_IMAGE_PATH = "/_next/image";

export function buildOptimizationUrl(
  imageUrl: string,
  width: ImageSize,
  hostname?: string,
): string {
  const searchParams = new URLSearchParams();

  searchParams.set("url", imageUrl);
  searchParams.set("w", String(width));
  searchParams.set("q", String(IMAGE_QUALITY));

  if (hostname) {
    return new URL(
      `${NEXT_IMAGE_PATH}?${searchParams.toString()}`,
      hostname,
    ).toString();
  }

  return `${NEXT_IMAGE_PATH}?${searchParams.toString()}`;
}

export const nextImagesConfig = {
  imageSizes: [...IMAGE_SIZES],
  qualities: [IMAGE_QUALITY],
  remotePatterns: [
    new URL("https://cdn-p.smehost.net/**"),
    new URL("https://dreimetadaten.de/data/**"),
    new URL("http://a1.mzstatic.com/**"),
  ],
};
