// TODO: depricate this file
import Axios from 'axios';
import { useEffect, useState } from 'react';

export function useFetch(url, options) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      console.log(url);
      setLoading(true);
      setData(null);
      try {
        const { data } = await Axios(url, options);
        setData(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, error, loading };
}
