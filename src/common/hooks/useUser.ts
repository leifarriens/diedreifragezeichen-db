import { AxiosError } from 'axios';
import { useSession } from 'next-auth/react';
import { useQuery } from 'react-query';

import { getUser } from '@/services/client';
import { User } from '@/types';

export function useUser() {
  const { data: session, status } = useSession();

  return useQuery<User, AxiosError>(['user', session?.user.id], getUser, {
    enabled: status === 'authenticated',
  });
}
