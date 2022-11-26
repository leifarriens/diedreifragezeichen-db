import { QueryClientConfig } from '@tanstack/react-query';
import { TRPCClientError } from '@trpc/client';
import toast from 'react-hot-toast';

import { AppRouter } from '@/server/routers/_app';

export const queryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      onError: (error) => {
        if (error instanceof TRPCClientError) {
          if (error.data.code !== 'NOT_FOUND') {
            toast.error('Ein Fehler ist aufgetreten :(');
          }
        }
      },
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
