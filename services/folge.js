const Folge = require('../models/folge')

const loadFolge = async (id) => {
  try {
    return Folge.findById(id)
  } catch (e) {
    throw new Error(e)
  }
}

const loadAllFolgen = async () => {
  try {
    return await Folge.find().sort('-release_date')
  } catch (e) {
    throw new Error(e.message)
  }
}

const loadAllRegularFolgen = async () => {
  try {
    return await Folge.find({ type: 'regular' }).sort('-release_date')
  } catch (e) {
    throw new Error(e.message)
  }
}

const loadMultipleFolgen = async (ids) => {
  try {
    return Folge.find({ _id: { $in: ids } })
  } catch (e) {
    throw new Error(e.message)
  }
}

const addFolgenRating = async (id, rating) => {
  try {
    const folge = await Folge.findById(id)

    folge.ratings.push(rating)

    return await folge.save()
  } catch (e) {
    throw new Error(e.message)
  }
}

const getPreviousFolgen = async (currentId) => {
  try {
    return await Folge.find({ _id: { $gt: currentId }, type: 'regular' })
      .sort({ _id: 1 })
      .limit(5)
  } catch (e) {
    throw new Error(e.message)
  }
}

const getNextFolgen = async (currentId) => {
  try {
    return await Folge.find({ _id: { $lt: currentId }, type: 'regular' })
      .sort({ _id: -1 })
      .limit(5)
  } catch (e) {
    throw new Error(e.message)
  }
}

const addFolge = async (name, images, id, release_date) => {
  const folge = new Folge({
    images,
    release_date,
    spotify_id: id,
  })

  if (name.includes('/')) {
    folge.type = 'regular'
    folge.number = name.split('/')[0]
    folge.name = name.split('/')[1]
  } else {
    folge.type = 'special'
    folge.number = ''
    folge.name = name
  }

  try {
    return await folge.save()
  } catch (e) {
    throw new Error(e.message)
  }
}

const removeFolge = async (id) => {
  try {
    return await Folge.deleteOne({ _id: id })
  } catch (e) {
    throw new Error(e.message)
  }
}

module.exports = {
  loadFolge,
  loadAllFolgen,
  loadAllRegularFolgen,
  loadMultipleFolgen,
  addFolgenRating,
  getPreviousFolgen,
  getNextFolgen,
  addFolge,
  removeFolge,
}
