import 'dayjs/locale/de';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.locale('de');
dayjs.extend(relativeTime);

export default dayjs;
