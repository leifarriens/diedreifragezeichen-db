import type { AxiosError } from 'axios';
import Axios from 'axios';

import artist from '../../../config/artist.json';

const DeezerApi = {
  artist: Axios.create({
    baseURL: 'https://api.deezer.com/artist',
    headers: {
      Authorization: `Bearer ${process.env.DEEZER_API_KEY}`,
    },
  }),
};

export const getAllAlbums = async () => {
  try {
    const { data } = await DeezerApi.artist.get<{
      data: {
        id: string | number;
        title: string;
      }[];
    }>(`/${artist.deezerId}/albums`, { params: { limit: 500 } });
    return data.data;
  } catch (e) {
    const error = e as AxiosError;
    console.log(error);
    console.log(error.response?.statusText);
    console.log(JSON.stringify(error.response?.data));

    throw Error(JSON.stringify(error.response?.data));
  }
};
