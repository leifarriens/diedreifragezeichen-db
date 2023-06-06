import type { QueryClientConfig } from '@tanstack/react-query';
import { TRPCClientError } from '@trpc/client';
import toast from 'react-hot-toast';

export const queryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
    mutations: {
      onError: (error) => {
        if (error instanceof TRPCClientError) {
          toast.error(`Ein Fehler ist aufgetreten: ${error.message}`);
        }
      },
    },
  },
};
