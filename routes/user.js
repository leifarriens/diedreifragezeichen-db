const router = require('express').Router();
const User = require('../models/user');
const mongoose = require('mongoose');
const ensureLogin = require('connect-ensure-login');


router.route('/:id')

  .get(ensureLogin.ensureLoggedIn('/auth/login'), async (req, res) => {
    const user = await User.findById(req.params.id);
    res.json(user);
  })

router.route('/:id/list')

  .get(ensureLogin.ensureLoggedIn('/auth/login'), async (req, res) => {
    const list = await User.findById(req.params.id).select('list');
    console.log(list);
    res.render('list', { list, user: req.user });
  })

  .post(ensureLogin.ensureLoggedIn('/auth/login'), async (req, res) => {
    const user = await User.findById(req.params.id);
    user.list.push(req.body.number);

    user.save()
      .then(() => res.redirect(`/user/${req.user._id}/list`))
      .catch(err => console.log(err));
  })

module.exports = router;