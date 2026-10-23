import type { NextConfig } from "next";

import { nextImagesConfig } from "@ddfdb/image-optimization";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: nextImagesConfig,
  pageExtensions: ["md", "mdx", "ts", "tsx"],
  reactCompiler: true,
};

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
});

export default withMDX(nextConfig);
