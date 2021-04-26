const cron = require('node-cron')

// const getBearerToken = require('./authSpotify');

// console.log(getBearerToken);

// const time = '15 4 * * *';
const time = '5 0 * * *'

cron.schedule(time, () => {
  console.log('running a task every minute')
})
