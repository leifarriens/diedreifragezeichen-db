/* eslint-disable @typescript-eslint/no-var-requires */
const Axios = require('axios');

module.exports = {
  async up(db) {
    const { data } = await Axios.get(
      'https://api.deezer.com/artist/71513/albums',
      {
        headers: {
          Authorization: `Bearer ${process.env.DEEZER_API_KEY}`,
        },
        params: {
          limit: 300,
        },
      },
    );

    const deezerAlbums = data.data.filter(({ title }) => {
      return !title.includes('ließt');
    });

    const folgen = await db.collection('folgen').find({}).toArray();

    const writes = folgen.map((folge) => {
      const deezerAlbum = deezerAlbums.find((album) =>
        album.title
          .replaceAll(' ', '')
          .match(new RegExp(folge.name.replaceAll(' ', ''), 'i')),
      );

      return {
        updateOne: {
          filter: { _id: folge._id },
          update: {
            $set: {
              ...(deezerAlbum && { deezer_id: deezerAlbum.id }),
            },
          },
        },
      };
    });

    await db.collection('folgen').bulkWrite(writes);
  },

  async down(db) {
    await db
      .collection('folgen')
      .updateMany({}, { $unset: { deezer_id: undefined } });
  },
};
