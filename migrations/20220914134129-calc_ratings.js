module.exports = {
  async up(db) {
    const folgen = await db.collection('folgen').find({}).toArray();

    for (let i = 0; i < folgen.length; i++) {
      const folge = folgen[i];

      const ratings = await db
        .collection('ratings')
        .find({ folge: folge._id })
        .toArray();

      if (ratings.length > 0) {
        const ratingsSum = ratings.reduce((curr, acc) => {
          return curr + acc.value;
        }, 0);

        const community_rating = ratingsSum / ratings.length;

        await db.collection('folgen').updateOne(
          { _id: folge._id },
          {
            $set: {
              community_rating: parseFloat(community_rating.toFixed(1)),
              number_of_community_ratings: ratings.length,
              community_popularity: ratingsSum,
            },
          },
        );
      }
    }
  },

  async down(db) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  },
};
