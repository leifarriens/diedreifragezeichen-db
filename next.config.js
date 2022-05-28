const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');

/**
 * @type {import('next').NextConfig}
 */
module.exports = async (phase, { defaultConfig }) => {
  const sharedConfig = {
    swcMinify: true,
    compiler: {
      // ssr and displayName are configured by default
      styledComponents: true,
      removeConsole: {
        exclude: ['error'],
      },
    },
    eslint: {
      ignoreDuringBuilds: false,
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

  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return {
      ...sharedConfig,
      env: {
        minRatingsToDisplay: 1,
      },
    };
  }

  return {
    ...sharedConfig,
    env: {
      minRatingsToDisplay: 5,
    },
  };
};
