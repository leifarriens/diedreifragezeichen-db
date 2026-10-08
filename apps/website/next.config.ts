import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL("https://cdn-p.smehost.net/**"),
      new URL("https://dreimetadaten.de/data/**"),
      new URL("http://a1.mzstatic.com/**"),
    ],
  },
  reactCompiler: true,
  transpilePackages: [
    "@ddfdb/archiv",
    "@ddfdb/core",
    "@ddfdb/db",
    "@ddfdb/user-api",
  ],
  typescript: {
    ignoreBuildErrors: true, // Typecheck runs separately from the build
  },
};

export default nextConfig;
