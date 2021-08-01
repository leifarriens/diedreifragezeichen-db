const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');

module.exports = (phase, { defaultConfig }) => {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return {
      eslint: {
        ignoreDuringBuilds: true,
      },
      env: {
        minRatingsToDisplay: 1,
      },
    };
  }

  return {
    env: {
      minRatingsToDisplay: 5,
    },
  };
};
