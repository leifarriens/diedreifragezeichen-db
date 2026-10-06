import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL("https://cdn-p.smehost.net/**")],
  },
  /* config options here */
  reactCompiler: true,
  transpilePackages: [
    "@ddfdb/archiv",
    "@ddfdb/core",
    "@ddfdb/db",
    "@ddfdb/user-api",
  ],
};

export default nextConfig;
