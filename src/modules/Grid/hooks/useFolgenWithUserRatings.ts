import { useSession } from 'next-auth/react';
import { trpc } from 'utils/trpc';

import type { FolgeWithId } from '@/models/folge';

export function useFolgenWithUserRatings(folgen: FolgeWithId[]) {
  const { status } = useSession();

  const { data } = trpc.user.ratings.useQuery(undefined, {
    enabled: status === 'authenticated',
  });

  if (!data) return folgen;

  return folgen.map((folge) => {
    const rating = data.find((rating) => rating.folge == folge._id);

    if (rating) {
      folge.user_rating = rating.value;
    }

    return folge;
  });
}
