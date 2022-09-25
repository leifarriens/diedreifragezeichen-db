module.exports = {
  async up(db) {
    const folgen = await db.collection('folgen').find({}).toArray();

    await Promise.all(
      folgen.map((folge) => {
        return db.collection('folgen').updateOne(
          { _id: folge._id },
          {
            $set: {
              rating: folge.community_rating,
              number_of_ratings: folge.number_of_community_ratings,
              popularity: folge.community_popularity,
            },
            $unset: {
              community_rating: '',
              number_of_community_ratings: '',
              community_popularity: '',
            },
          },
        );
      }),
    );
  },

  async down(db) {
    const folgen = await db.collection('folgen').find({}).toArray();

    await Promise.all(
      folgen.map((folge) => {
        return db.collection('folgen').updateOne(
          { _id: folge._id },
          {
            $set: {
              community_rating: folge.rating,
              number_of_community_ratings: folge.number_of_ratings,
              community_popularity: folge.popularity,
            },
            $unset: {
              rating: '',
              number_of_ratings: '',
              popularity: '',
            },
          },
        );
      }),
    );
  },
};
