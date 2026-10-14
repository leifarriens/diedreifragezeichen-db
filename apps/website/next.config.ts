import type { NextConfig } from "next";

import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    imageSizes: [64, 512],
    remotePatterns: [
      new URL("https://cdn-p.smehost.net/**"),
      new URL("https://dreimetadaten.de/data/**"),
      new URL("http://a1.mzstatic.com/**"),
    ],
  },
  pageExtensions: ["md", "mdx", "ts", "tsx"],
  reactCompiler: true,
  transpilePackages: [
    "@ddfdb/archiv",
    "@ddfdb/client",
    "@ddfdb/core",
    "@ddfdb/db",
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
