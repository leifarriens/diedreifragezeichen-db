import type { QueryClientConfig } from '@tanstack/react-query';
import { TRPCClientError } from '@trpc/client';
import toast from 'react-hot-toast';

import type { AppRouter } from '@/server/routers/_app';

export const queryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
    mutations: {
      onError: (error) => {
        if (error instanceof TRPCClientError<AppRouter>) {
          toast.error(`Ein Fehler ist aufgetreten: ${error.message}`);
        }
      },
    },
  },
};
