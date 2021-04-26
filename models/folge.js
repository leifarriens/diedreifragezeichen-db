import mongoose from 'mongoose'

// Folge Schema
const folgeSchema = mongoose.Schema(
  {
    images: Array,
    ratings: [
      {
        type: Number,
        default: 0,
      },
    ],
    name: String,
    number: String,
    type: String,
    release_date: Date,
    spotify_id: String,
  },
  {
    collection: 'folgen',
  }
)

mongoose.models = {}

var Folge = mongoose.model('Folge', folgeSchema)

export default Folge
