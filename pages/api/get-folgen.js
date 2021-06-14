import { CronJob } from 'quirrel/next'
import SyncFolgen from '../../jobs/sync-folgen'

export default CronJob(
  "api/get-folgen", // 👈 the route that it's reachable on
  "0 1 * * *", // see (https://crontab.guru/)
  async () => {
    await SyncFolgen()
  }
);