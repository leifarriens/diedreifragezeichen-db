import 'dayjs/locale/de';

import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.locale('de');

export default dayjs;
