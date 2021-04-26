import connectDB from '../../../middleware/mongodb'
import Folge from '../../../models/folge'

const handler = async ({ method, query: { id } }, res) => {
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

export default connectDB(handler)
