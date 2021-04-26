// import connectDB from '../../../middleware/mongodb'
import dbConnect from '../../../db'
import Folge from '../../../models/folge'

export default async function handler ({ method, query: { id } }, res) {
  await dbConnect()

  console.log(id);
  switch (method) {
    case 'GET':
      const folge = await Folge.findById(id)
      res.json(folge)
      break
    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}
