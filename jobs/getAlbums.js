const fs = require('fs');
const Axios = require('axios');
const { off } = require('../models/user');
const TOKEN = 'BQDeErjTtxn_Yvh5Hq5MrA1eDVThrSEstDjKf4g8mMOHctnE_93GV5RSh4Nc_cGbeeB0hqpxWloLEiTR34k';

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
  fs.writeFileSync('allefolgen.json', jsondata);
}

getAlbums();