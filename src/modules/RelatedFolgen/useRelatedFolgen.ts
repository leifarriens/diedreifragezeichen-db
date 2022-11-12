import { trpc } from 'utils/trpc';

export function useRelatedFolgen(
  folgeId: string,
  options: { enabled: boolean },
) {
  const { data, isLoading } = trpc.folge.related.useQuery({ folgeId }, options);

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
