/**
 * This Job fetches all Die drei ??? Folgen from Spotify
 * and writes it to local JSON file
 */

const fs = require('fs');
const Axios = require('axios');
const TOKEN = 'BQCr7gAqUPUmxVh8GKX7OwpDIkt0CbZ9ZAS2Mzgpl7LzY6z6Nlm4lrs3aPXQta1ovKIFTbMvnqclRT_2nCY';
const chalk = require('chalk');

(async () => {
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
  
  albums.map(entry => delete entry.artists);
  fs.writeFileSync('allefolgen.json', JSON.stringify(albums));

  console.log(`Fetched ${chalk.green(albums.length)} folgen from Spotify`);
})();
