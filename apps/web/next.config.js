/** @type {import("next").NextConfig} */
const config = {
  swcMinify: true,
  poweredByHeader: false,
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['i.scdn.co'],
  },
  async rewrites() {
    return [];
  },
  async redirects() {
    return [
      { source: '/folgen', destination: '/', permanent: false },
      { source: '/login', destination: '/signin', permanent: false },
    ];
  },
};

export default config;
