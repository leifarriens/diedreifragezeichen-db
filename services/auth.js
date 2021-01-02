const bcrypt = require('bcryptjs');
const User = require('../models/user');

const registerUser = async (data) => {
  console.log(data);
  const {
    email,
    password,
    name
  } = data;

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  const user = new User({
    email,
    password: hash,
    created_at: new Date(),
    name
  });

  try {
    return user.save();
  } catch (e) {
    throw new Error(e.message);
  }
}

const getUserByEmail = async (email) => {
  try {
    return await User.findOne({ email });
  } catch (e) {
    throw new Error(e.message);
  }
}

module.exports = {
  registerUser,
  getUserByEmail
}