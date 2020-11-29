const Axios = require('Axios');
const chalk = require('chalk');
require('dotenv').config();

const { getBearerToken } = require('./authSpotify');

const getAlleFolgenFromSpotify = async (bearerToken) => {
  let albums = [];
  let offset = 0;

  const doRun = async (offset) => {
    const response = await Axios(`https://api.spotify.com/v1/artists/3meJIgRw7YleJrmbpbJK6S/albums?country=DE&include_groups=album&limit=50&offset=${offset}`, {
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + bearerToken}
    });

    albums = albums.concat(response.data.items);

    if (response.data.total > offset) {
      offset = offset + 50;
      await doRun(offset);
    }
  }

  await doRun(offset);
  
  albums.map(entry => delete entry.artists);

  return albums;
}

(async () => {
  try {
    const token = await getBearerToken();
    const alleFolgen = await getAlleFolgenFromSpotify(token);
    console.log(`Fetched ${chalk.blue(alleFolgen.length)} from Spotify`);
  } catch (error) {
    console.log(error); 
  }
  return;
})();
