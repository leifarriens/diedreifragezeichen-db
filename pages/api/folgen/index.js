const { dbConnect } = require('../../../db');
const Folge = require('../../../models/folge');

const handler = async (req, res) => {
  await dbConnect();
  console.log('copnnezte');
  const folgen = await Folge.find({});

  res.json(folgen);
  // if (req.method === 'GET') {
  //   const folgen = await Folge.find({});
  //   res.status(200).json(folgen);
  // }
}

export default handler;
