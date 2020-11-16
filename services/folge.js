const Folge = require('../models/folge');

const loadFolge = async (id) => {
  try {
    return Folge.findById(id);
  }
  catch(e) {
    throw new Error(e);
  }
}

const loadAllFolgen = async () => {
  try {
    return await Folge.find({ type: 'regular' }).sort('-release_date')
  }
  catch (e) {
    throw new Error(e.message);
  }
}

const loadMultipleFolgen = async (ids) => {
  try {
    return Folge.find({ '_id': { $in: ids}});
  } catch (e) {
    throw new Error(e.message);
  }
}

const addFolgenRating = async (id, rating) => {
  try {
    const folge = await Folge.findById(id);

    folge.ratings.push(rating);

    return await folge.save();
  }
  catch (e) {
    throw new Error(e.message);
  }
}

const getPreviousFolgen = async (currentId) => {
  try {
    return await Folge.find({_id: {$gt: currentId}, type: 'regular'}).sort({_id: 1}).limit(5);
  } catch (e) {
    throw new Error(e.message);
  }
}

const getNextFolgen = async (currentId) => {
  try {
    // return await Folge.findOne({_id: {$lt: currentId}}).sort({_id: -1});
    return await Folge.find({_id: {$lt: currentId}, type: 'regular'}).sort({_id: -1}).limit(5);
  } catch (e) {
    throw new Error(e.message);
  }
}

module.exports = {
  loadFolge,
  loadAllFolgen,
  loadMultipleFolgen,
  addFolgenRating,
  getPreviousFolgen,
  getNextFolgen
}