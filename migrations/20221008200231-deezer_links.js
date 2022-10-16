/* eslint-disable @typescript-eslint/no-var-requires */
const Axios = require('axios');
const { title } = require('process');

module.exports = {
  async up(db) {
    const { data } = await Axios.get(
      'https://api.deezer.com/artist/71513/albums',
      {
        params: {
          limit: 300,
        },
      },
    );

    const deezerAlbums = data.data.filter(({ title }) =>
      title.includes('ließt'),
    );

    const folgen = await db.collection('folgen').find({}).toArray();

    for (let i = 0; i < folgen.length; i++) {
      const folge = folgen[i];
      const deezerAlbum = deezerAlbums.find((album) =>
        album.title
          .replaceAll(' ', '')
          .match(new RegExp(folge.name.replaceAll(' ', ''), 'i')),
      );

      if (deezerAlbum) {
        await db
          .collection('folgen')
          .updateOne(
            { _id: folge._id },
            { $set: { deezer_id: deezerAlbum.id } },
          );
      }
    }
  },

  async down(db) {
    await db
      .collection('folgen')
      .updateMany({}, { $unset: { deezer_id: undefined } });
  },
};
