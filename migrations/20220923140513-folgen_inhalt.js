/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');

module.exports = {
  async up(db) {
    const jsonData = JSON.parse(
      fs.readFileSync(
        path.resolve(__dirname, '..', 'scripts', 'scrape-result.json'),
      ),
    );

    for (let i = 0; i < jsonData.length; i++) {
      const entry = jsonData[i];

      await db.collection('folgen').updateOne(
        {
          name: {
            $regex: new RegExp(
              entry.name.replace('und', '').replace('???', '').trim(),
              'i',
            ),
          },
        },
        { $set: { inhalt: entry.body } },
      );
    }
  },

  async down(db) {
    await db
      .collection('folgen')
      .updateMany({}, { $unset: { inhalt: undefined } });
  },
};
