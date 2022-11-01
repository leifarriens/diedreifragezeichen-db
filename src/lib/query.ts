import { QueryCache, QueryClient } from 'react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
  queryCache: new QueryCache({
    // TODO: query Errors should be handled here
    onError: (error, query) => {
      console.error(error, query);
    },
  }),
});
