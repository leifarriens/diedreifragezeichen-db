const mongoose = require('mongoose')

// User Schema
const userSchema = mongoose.Schema({
  name: String,
  email: String,
  password: String,
  created_at: Date,
  list: Array,
})

const User = (module.exports = mongoose.model('User', userSchema))
