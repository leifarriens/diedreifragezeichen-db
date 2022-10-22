import Axios, { AxiosError } from 'axios';
import qs from 'qs';

import { SpotifyAlbum } from '@/types';

import artist from '../../config/artist.json';

const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = process.env;

const SpotifyAPI = {
  accounts: Axios.create({
    baseURL: 'https://accounts.spotify.com/api',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization:
        'Basic ' +
        Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString(
          'base64',
        ),
    },
  }),
  artists: Axios.create({
    baseURL: 'https://api.spotify.com/v1/artists',
  }),
};

const getBearerToken = async () => {
  try {
    const response = await SpotifyAPI.accounts.post(
      '/token',
      qs.stringify({
        grant_type: 'client_credentials',
      }),
    );
    return response.data.access_token;
  } catch (e) {
    const error = e as AxiosError;
    console.log(error);
    console.log(error.response?.statusText);
    console.log(JSON.stringify(error.response?.data));
  }
};

export const getAllAlbums = async () => {
  try {
    const bearerToken = await getBearerToken();
    let albums: SpotifyAlbum[] = [];
    let offset = 0;

    const doRun = async () => {
      const response = await SpotifyAPI.artists.get<{
        total: number;
        items: SpotifyAlbum[];
      }>(`/${artist.artistId}/albums`, {
        headers: { Authorization: 'Bearer ' + bearerToken },
        params: {
          country: 'DE',
          include_groups: 'album',
          offset,
          limit: 50,
        },
      });

      albums = albums.concat(response.data.items);
      if (response.data.total > offset) {
        offset = offset + 50;
        await doRun();
      }
    };

    await doRun();

    albums.map((album) => delete album.artists);
    return albums;
  } catch (e) {
    const error = e as AxiosError;
    console.log(error);
    console.log(error.response?.statusText);
    console.log(JSON.stringify(error.response?.data));

    throw Error(JSON.stringify(error.response?.data));
  }
};
