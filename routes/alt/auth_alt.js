const router = require('express').Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

router.route('/login')

  .get(async (req, res) => {
    res.render('login', { user: req.user });
  })

  .post((req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return res.status(401).json(err)
      };
      if (!user) {
        return res.status(401).json(info);
      };
      req.logIn(user, err => {
        if (err) {
          return res.status(401).json(err)
        };
        return res.redirect('/');
      });
    })(req, res, next);
  });

router.route('/logout')
  .get(async (req, res) => {
    req.logOut();
    res.redirect('/');
  });

router.route('/register')

  .get(async (req, res) => {
    res.render('register', { user: req.user });
  })

  .post(async (req, res) => {
    const {
      email,
      password,
      password2,
      name
    } = req.body;
    console.log(req.body);

    const user = new User({
      email,
      password,
      created_at: new Date(),
      name
    });

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) console.log(err);

        user.password = hash;
        console.log(user);
        user.save(err => {
          if (err) {
            console.log(err);
            return;
          } else {
            res.json('user created')
            // res.redirect('/auth/login');
          }
        });
      });
    });
  });

module.exports = router;