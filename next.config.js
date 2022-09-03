const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: false,
});

/**
 * @type {import('next').NextConfig}
 */
module.exports = async (phase, { defaultConfig }) => {
  const sharedConfig = {
    ...defaultConfig,
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
    experimental: { images: { allowFutureImage: true } },
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
      ...sharedConfig,
      env: {
        // TODO: Implement
        minRatingsToDisplay: 1,
      },
    };
  }

  // production specific config
  return withBundleAnalyzer({
    ...sharedConfig,
    swcMinify: true,
    poweredByHeader: false,
    compiler: {
      removeConsole: {
        exclude: ['error'],
      },
    },
    env: {
      minRatingsToDisplay: 5,
    },
  });
};
