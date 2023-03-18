import { useSession } from 'next-auth/react';

import { trpc } from '@/utils/trpc';

export function useUser() {
  const { status } = useSession();

  return trpc.user.self.useQuery(undefined, {
    enabled: status === 'authenticated',
  });
}
