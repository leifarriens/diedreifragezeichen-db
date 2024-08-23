import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

import { trpc } from '@/utils/trpc';

const staleTime = 5 * 1000 * 60;
const cacheTime = 5 * 1000 * 60;

export function useUserList() {
  const { status } = useSession();

  return trpc.list.all.useQuery(undefined, {
    enabled: status === 'authenticated',
    staleTime,
    cacheTime,
  });
}

const limit = 20;

export function useUserListFolgen() {
  const { status } = useSession();

  return trpc.list.allFolgen.useInfiniteQuery(
    { limit },
    {
      getNextPageParam: (lastPage) => {
        if (lastPage.offset + lastPage.limit < lastPage.total) {
          return lastPage.offset + lastPage.limit;
        }
        return undefined;
      },
      enabled: status === 'authenticated',
      onError() {
        toast.error('Fehler beim laden der Merkliste');
      },
    },
  );
}

export function useUserListFolgenUtils() {
  const utils = trpc.useUtils();

  return {
    invalidateUserFolgenList: async () => {
      await utils.list.allFolgen.invalidate();
    },
    setDataRemoveFolge: (folgeId: string) => {
      utils.list.allFolgen.setInfiniteData({ limit }, (data) => {
        if (!data) {
          return {
            pages: [],
            pageParams: [],
          };
        }
        return {
          ...data,
          pages: data.pages.map((page) => ({
            ...page,
            items: page.items.filter(
              (folge) => folge._id.toString() !== folgeId,
            ),
            total: page.total - 1,
          })),
        };
      });
    },
  };
}
