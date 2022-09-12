import { AxiosError } from 'axios';
import { useSession } from 'next-auth/react';
import { useQuery } from 'react-query';

import type { UserWithId } from '@/models/user';
import { getUser } from '@/services/client';

export function useUser() {
  const { data: session, status } = useSession();

  return useQuery<UserWithId, AxiosError>(['user', session?.user.id], getUser, {
    enabled: status === 'authenticated',
  });
}
