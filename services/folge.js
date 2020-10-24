const Folge = require('../models/folge');

const loadFolge = async (id) => {
  try {
    return Folge.findById(id);
  }
  catch(e) {
    throw new Error(e.message);
  }
}

const loadAllFolgen = async () => {
  try {
    return Folge.find({ type: 'regular' }).sort('-number');
  }
  catch (e) {
    throw new Error(e.message);
  }
}

const addFolgenRating = async (id, rating) => {
  try {
    const folge = await Folge.findById(id);
    console.log(folge);
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
  addFolgenRating,
  getPreviousFolgen,
  getNextFolgen
}