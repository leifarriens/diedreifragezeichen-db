/* eslint-disable @typescript-eslint/no-var-requires */
const dayjs = require('dayjs');
const de = require('dayjs/locale/de');
const relative = require('dayjs/plugin/relativeTime');
dayjs.extend(relative);
dayjs.locale(de);

module.exports = dayjs;
