module.exports = {
  async up(db) {
    const folgen = await db.collection('folgen').find({}).toArray();

    for (let i = 0; i < folgen.length; i++) {
      const folge = folgen[i];

      await db.collection('folgen').updateOne(
        { _id: folge._id },
        {
          $set: {
            number: folge.number.match(/\d/g)?.join('') || '',
          },
        },
      );
    }
  },

  async down(db, client) {
    // TODO write the statements to rollback your migration (if possible)
  },
};
