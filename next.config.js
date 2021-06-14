const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')

module.exports = (phase, { defaultConfig }) => {
  console.log(phase);
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return {
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
