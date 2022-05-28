const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');

/**
 * @type {import('next').NextConfig}
 */
module.exports = async (phase, { defaultConfig }) => {
  const sharedConfig = {
    reactStrictMode: true,
    compiler: {
      // ssr and displayName are configured by default
      styledComponents: true,
    },
    eslint: {
      ignoreDuringBuilds: true,
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
      ...sharedConfig,
      env: {
        // TODO: Implement
        minRatingsToDisplay: 1,
      },
    };
  }

  // production specific config
  return {
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
  };
};
