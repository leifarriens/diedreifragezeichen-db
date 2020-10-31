const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const { registerUser, getUserByEmail } = require('../services/auth');

router.post('/register', async (req, res) => {
  try {
    const user = await registerUser(req.body);
    res.json(user);
  } catch (e) {
    console.log(e.message);
  }
});

router.post('/login', async (req, res) => {
  try {
    const user = await getUserByEmail(req.body.email);

    const match = await bcrypt.compare(req.body.password, user.password);

    if (match) {
      const token = jwt.sign({user}, process.env.ACCESS_TOKEN_SECRET);
      user.password = undefined;
      res.json({user, token});
    } else {
      res.status(401).json({message: 'wrong pw'});
    }
  } catch (e) {
    res.status(401).json(e.message);
    console.log(e.message);
  }
});

module.exports = router;