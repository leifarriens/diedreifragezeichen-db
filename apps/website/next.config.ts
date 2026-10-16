import type { NextConfig } from "next";

import { nextImagesConfig } from "@ddfdb/image-optimization";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: nextImagesConfig,
  pageExtensions: ["md", "mdx", "ts", "tsx"],
  reactCompiler: true,
  transpilePackages: [
    "@ddfdb/archiv",
    "@ddfdb/client",
    "@ddfdb/core",
    "@ddfdb/db",
    "@ddfdb/image-optimization",
    "@ddfdb/legacy-api",
    "@ddfdb/user-api",
  ],
  typescript: {
    ignoreBuildErrors: true, // Typecheck runs separately from the build
  },
};

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
});

export default withMDX(nextConfig);
