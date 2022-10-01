import { useQuery, UseQueryOptions } from 'react-query';

import type { Folge } from '@/models/folge';
import { getAltFolgen } from '@/services/client';

export function useAltFolgen(
  folgeId: string,
  options?: UseQueryOptions<Folge[], unknown, Folge[], string[]>,
) {
  return useQuery([folgeId, 'alt'], () => getAltFolgen(folgeId), options);
}
