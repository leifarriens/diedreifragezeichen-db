const Folge = require('../../models/folge')
const chalk = require('chalk')
require('dotenv').config()

const { addFolge } = require('../../services/folge.js')

const getAllDbFolgen = async () => {
  try {
    const folgen = await Folge.find({})
    return folgen
  } catch (error) {
    console.log(error)
  }
}

const addNewFolge = async (folge) => {
  try {
    const { name, images, id, release_date } = folge
    console.log('plaesde add' + name)
    const addedFolge = await addFolge(name, images, id, release_date)
    return addedFolge
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  getAllDbFolgen,
  addNewFolge,
}
