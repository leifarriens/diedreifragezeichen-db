/**
 * This Job fetches all Die drei ??? Folgen from Spotify
 * and writes it to local JSON file
 */

const fs = require('fs');
const Axios = require('axios');
const TOKEN = 'BQB7cB1Ft141s72p_04y0x4LfHn_BU6TxeSPCaiapYyBddLLs72mQ2tiNcjv5XEBWzwDzW7NpctR-j1f30o';

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