import Axios from 'axios';
import qs from 'qs';

const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = process.env;

// TODO: should move to config
const ARTISTS_ID = '3meJIgRw7YleJrmbpbJK6S';

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

export const getBearerToken = async () => {
  try {
    const response = await SpotifyAPI.accounts.post(
      '/token',
      qs.stringify({
        grant_type: 'client_credentials',
      }),
    );
    return response.data.access_token;
  } catch (error: any) {
    console.log(error);
    console.log(error.response.statusText);
    console.log(JSON.stringify(error.response.data));
  }
};

export const getAllAlbums = async (bearerToken: string) => {
  let albums: any = [];
  const offset = 0;

  const doRun = async (offset: number) => {
    const response = await SpotifyAPI.artists.get(
      `/${ARTISTS_ID}/albums?country=DE&include_groups=album&limit=50&offset=${offset.toString}`,
      {
        headers: { Authorization: 'Bearer ' + bearerToken },
      },
    );

    albums = albums.concat(response.data.items);
    if (response.data.total > offset) {
      offset = offset + 50;
      await doRun(offset);
    }
  };

  await doRun(offset);

  albums.map((entry: any) => delete entry.artists);
  console.log(albums[0]);
  return albums;
};