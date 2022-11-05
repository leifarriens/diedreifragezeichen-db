import { useQuery, UseQueryOptions } from 'react-query';

import type { FolgeWithId } from '@/models/folge';
import { getRelatedFolgen } from '@/services/client';

export function useRelatedFolgen(
  folgeId: string,
  options?: UseQueryOptions<FolgeWithId[], unknown, FolgeWithId[], string[]>,
) {
  const { data, isLoading } = useQuery(
    [folgeId, 'related'],
    () => getRelatedFolgen(folgeId),
    options,
  );

  if (!data) {
    return {
      related: undefined,
      prevId: undefined,
      nextId: undefined,
    };
  }

  const currentIndex = data.findIndex((folge) => folge._id === folgeId);

  return {
    isLoading,
    related: data,
    prevId: currentIndex !== 0 ? data[currentIndex - 1]._id : null,
    nextId:
      currentIndex !== data.length - 1 ? data[currentIndex + 1]._id : null,
  };
}
