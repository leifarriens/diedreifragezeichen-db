import Axios, { AxiosError } from 'axios';

import artist from '../../config/artist.json';

const DeezerApi = {
  artist: Axios.create({
    baseURL: 'https://api.deezer.com/artist',
  }),
};

export const getAllAlbums = async () => {
  try {
    const { data } = await DeezerApi.artist.get(
      `/${artist.deezerArtistId}/albums`,
    );
    return data.data;
  } catch (e) {
    const error = e as AxiosError;
    console.log(error);
    console.log(error.response?.statusText);
    console.log(JSON.stringify(error.response?.data));

    throw Error(JSON.stringify(error.response?.data));
  }
};
