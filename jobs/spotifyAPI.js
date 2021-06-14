const Axios = require('axios');
const qs = require('qs');
require('dotenv').config();

const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = process.env;

const getBearerToken = async () => {
  try {
    const response = await Axios('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization:
          'Basic ' +
          Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString(
            'base64'
          ),
      },
      data: qs.stringify({
        grant_type: 'client_credentials',
      }),
    });
    return response.data.access_token;
  } catch (error) {
    console.log(error);
    console.log(error.response.statusText);
    console.log(JSON.stringify(error.response.data));
  }
};

const getAllAlbums = async (bearerToken) => {
  let albums = [];
  let offset = 0;

  const doRun = async (offset) => {
    const response = await Axios(
      `https://api.spotify.com/v1/artists/3meJIgRw7YleJrmbpbJK6S/albums?country=DE&include_groups=album&limit=50&offset=${offset}`,
      {
        method: 'GET',
        headers: { Authorization: 'Bearer ' + bearerToken },
      }
    );

    albums = albums.concat(response.data.items);

    if (response.data.total > offset) {
      offset = offset + 50;
      await doRun(offset);
    }
  };

  await doRun(offset);

  albums.map((entry) => delete entry.artists);

  return albums;
};

module.exports = {
  getBearerToken,
  getAllAlbums,
};
