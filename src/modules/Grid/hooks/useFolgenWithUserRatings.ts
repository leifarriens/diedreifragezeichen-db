import { useSession } from 'next-auth/react';
import { useMemo } from 'react';

import type { PublicFolge } from '@/utils/maskFolgeForPublic';
import { trpc } from '@/utils/trpc';

export function useFolgenWithUserRatings(folgen: PublicFolge[]) {
  const { status } = useSession();

  const { data } = trpc.rating.userRatings.useQuery(undefined, {
    enabled: status === 'authenticated',
  });

  const folgenWithRating = useMemo(() => {
    return data
      ? folgen.map((folge) => {
          const rating = data.find((rating) => rating.folge == folge._id);

          if (rating) {
            folge.user_rating = rating.value;
          }

          return folge;
        })
      : folgen;
  }, [data, folgen]);

  return folgenWithRating;
}
