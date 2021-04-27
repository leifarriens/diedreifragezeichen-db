const Folge = require('../../models/folge');
const chalk = require('chalk');
require('dotenv').config();

// const { addFolge } = require('../../services/folge.js');

const getAllDbFolgen = async () => {
  try {
    const folgen = await Folge.find({});
    return folgen;
  } catch (error) {
    console.log(error);
  }
};

const addNewFolge = async (name, images, id, release_date) => {
  try {
    const folge = new Folge({
      images,
      release_date,
      spotify_id: id,
    });

    if (name.includes('/')) {
      folge.type = 'regular';
      folge.number = name.split('/')[0];
      folge.name = name.split('/')[1];
    } else {
      folge.type = 'special';
      folge.number = '';
      folge.name = name;
    }

    return await folge.save();
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getAllDbFolgen,
  addNewFolge,
};
