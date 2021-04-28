const mongoose = require('mongoose');

// User Schema
const userSchema = mongoose.Schema({
  name: String,
  email: String,
  password: String,
  created_at: Date,
  list: Array,
  ratings: {
    type: Array,
    default: []
  }
  // ratings: [{
  //   folge: String,
  //   rating: {
  //     type: Number,
  //     default: 0
  //   }
  // }]
});

// const User = mongoose.model('User', userSchema);

// module.exports = User;
