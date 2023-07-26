import { useSession } from 'next-auth/react';

import { trpc } from '@/utils/trpc';

export function useUserList() {
  const { status } = useSession();

  return trpc.list.all.useQuery(undefined, {
    enabled: status === 'authenticated',
  });
}
