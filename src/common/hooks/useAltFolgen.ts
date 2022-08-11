import { useQuery } from 'react-query';

import { getAltFolgen } from '@/services/client';

export function useAltFolgen(folgeId: string) {
  return useQuery([folgeId, 'alt'], () => getAltFolgen(folgeId));
}
