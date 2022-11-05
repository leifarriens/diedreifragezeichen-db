import axios from 'axios';
import toast from 'react-hot-toast';
import { QueryCache, QueryClient } from 'react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        if (error.response?.status !== 404) {
          toast.error(
            error.response?.statusText || 'Ein Fehler ist aufgetreten :(',
          );
        }
      } else {
        console.error(error);
      }
    },
  }),
});
