import { useQuery, UseQueryOptions } from 'react-query';

import type { FolgeWithId } from '@/models/folge';
import { getAltFolgen } from '@/services/client';

export function useAltFolgen(
  folgeId: string,
  options?: UseQueryOptions<FolgeWithId[], unknown, FolgeWithId[], string[]>,
) {
  return useQuery([folgeId, 'alt'], () => getAltFolgen(folgeId), options);
}
