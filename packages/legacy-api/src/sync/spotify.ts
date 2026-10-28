import type { AxiosError } from "axios";

import Axios from "axios";
import qs from "qs";

import artist from "./artist.json";

export interface SpotifyAlbum {
  artists: unknown;
  id: string;
  images: {
    height: number;
    url: string;
    width: number;
  }[];
  name: string;
  release_date: string;
}

const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = process.env;

const SpotifyAPI = {
  accounts: Axios.create({
    baseURL: "https://accounts.spotify.com/api",
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(
          `${SPOTIFY_CLIENT_ID ?? ""}:${SPOTIFY_CLIENT_SECRET ?? ""}`,
        ).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
  }),
  albums: Axios.create({
    baseURL: "https://api.spotify.com/v1/albums",
  }),
  artists: Axios.create({
    baseURL: "https://api.spotify.com/v1/artists",
  }),
};

const getBearerToken = async () => {
  try {
    const response = await SpotifyAPI.accounts.post<{ access_token: string }>(
      "/token",
      qs.stringify({
        grant_type: "client_credentials",
      }),
    );
    return response.data.access_token;
  } catch (e) {
    const error = e as AxiosError;
    console.log(error);
    console.log(error.response?.statusText);
    console.log(JSON.stringify(error.response?.data));
    throw new Error(error.response?.statusText, { cause: e });
  }
};

export const getAllAlbums = async () => {
  try {
    const bearerToken = await getBearerToken();
    let albums: SpotifyAlbum[] = [];
    let offset = 0;

    const doRun = async () => {
      const response = await SpotifyAPI.artists.get<{
        items: SpotifyAlbum[];
        total: number;
      }>(`/${artist.spotifyId}/albums`, {
        headers: { Authorization: "Bearer " + bearerToken },
        params: {
          country: "DE",
          include_groups: "album",
          limit: 50,
          offset,
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

    throw new Error(JSON.stringify(error.response?.data), { cause: e });
  }
};
