import { useSession } from 'next-auth/react';
import { useQuery } from 'react-query';

import { FolgeWithId } from '@/models/folge';
import { getUserRatings } from '@/services/client';

export function useFolgenWithUserRatings(folgen: FolgeWithId[]) {
  const { data: session, status } = useSession();

  const { data } = useQuery(
    [session?.user.id, 'ratings'],
    () => getUserRatings(),
    {
      enabled: status === 'authenticated',
    },
  );

  if (!data) return folgen;

  return folgen.map((folge) => {
    const rating = data.find(
      (rating) => rating.folge.toString() == folge._id.toString(),
    );

    if (rating) {
      folge.user_rating = rating.value;
    }

    return folge;
  });
}
