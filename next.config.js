const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: false,
});

module.exports = async (phase) => {
  /**
   * @type {import('next').NextConfig}
   */
  const nextConfig = {
    // ...cfg.defaultConfig,
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
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'i.scdn.co',
        },
      ],
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

  // development specific config
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return {
      ...nextConfig,
    };
  }

  // production specific config
  return withBundleAnalyzer({
    ...nextConfig,
    compiler: {
      removeConsole: {
        exclude: ['error'],
      },
    },
  });
};
