const fs = require('fs');
const Axios = require('axios');
const TOKEN = 'BQC2SFqikK-vV3oGRexVFJeks-j27RhvQcxaO8cWD-urpDd9J_FuMAlktig2Fz7jNajRuVu5jLU3H3Zbf9o';
require('dotenv').config();

const getAlbums = async () => {
  let albums = [];
  let offset = 0;


  const doRun = async (offset) => {
    const response = await Axios(`https://api.spotify.com/v1/artists/3meJIgRw7YleJrmbpbJK6S/albums?country=DE&include_groups=album&limit=50&offset=${offset}`, {
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + TOKEN}
    });

    albums = albums.concat(response.data.items);

    if (response.data.total > offset) {
      offset = offset + 50;
      await doRun(offset);
    }
  }

  await doRun(offset);
  console.log(albums);
  let jsondata = JSON.stringify(albums);
  fs.writeFileSync('allefolgen2.json', jsondata);
}

const authSpotify = async () => {
  const response = await Axios('https://accounts.spotify.com/api/token', {
    method: 'POST',
    data: { 'grant_type': 'client_credentials' },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Bearer ' + process.env.SPOTIFY_TOKEN
    }
  });
  console.log(response.data);

  return response.data.access_token;
}

getAlbums();