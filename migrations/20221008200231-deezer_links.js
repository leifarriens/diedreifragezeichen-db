/* eslint-disable @typescript-eslint/no-var-requires */
const Axios = require('axios');
const dayjs = require('dayjs');

module.exports = {
  async up(db, client) {
    const { data } = await Axios.get(
      'https://api.deezer.com/artist/71513/albums',
    );
    console.log(data);
    const deezerAlbums = data.data;
    const folgen = await db.collection('folgen').find({}).toArray();

    await Promise.all(
      folgen.map((folge) => {
        const deezerAlbum = deezerAlbums.find((album) =>
          album.title
            .replaceAll(' ', '')
            .match(new RegExp(folge.name.replaceAll(' ', ''), 'i')),
        );

        if (deezerAlbum) {
          console.log(deezerAlbum.title);
        }
      }),
    );
  },

  async down(db, client) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  },
};
