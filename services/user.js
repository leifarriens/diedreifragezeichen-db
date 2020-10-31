const User = require('../models/user');

const loadUser = async (id) => {
  try {
    const user = await User.findById(id);
    user.password = undefined;
    return user;
  } catch (e) {
    throw new Error(e.message);
  }
}

const addFolgeToUserList = async (id, folge) => {
  try {
    const user = await User.findById(id);

    folge.added_at = new Date();

    user.list.push(folge);
    return await user.save();
  }
  catch(e) {
    throw new Error(e.message);
  }
}

module.exports = {
  loadUser,
  addFolgeToUserList
}