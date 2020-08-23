const router = require('express').Router();
const ensureLogin = require('connect-ensure-login');
const moment = require('moment');

const Folge = require('../models/folge');

router.route('/')

  .get(async (req, res) => {
    let folgen = await Folge.find({}).select('-ratings');
    res.json(folgen);
  })

  .post(async (req, res) => {
    const { title, number } = req.body;
  
    const folge = new Folge();
    folge.title = title;
    folge.number = number;
  
    folge.save()
    .then(() => res.json({
      message: 'Folge gespeichert!'
    }))
    .catch(err => console.log(err));
  });

router.route('/:number')

  .get(async (req, res) => {
    
    try {
      const folge = await Folge.findById(req.params.number);
      // const folge = await Folge.findOne({ number: req.params.number });
      // if (moment(new Date(folge.release).toISOString()).isValid()) {
      //   const momentObj = moment(new Date(folge.release).toISOString());
      //   folge.release = momentObj.format('DD.MM.YYYY');
      // }
      console.log(folge);
      if (folge) {
        res.render('folge', {folge, user: req.user});
      } else {
        res.render('404', { user: req.user });
      }

    } catch (err) {
      console.log(err);
      res.render('404');
    }
  });

router.route('/:number/rate')

  .post(ensureLogin.ensureLoggedIn('/auth/login'), async (req, res) => {

    const getRating = folge => {
      let s = 0;

      folge.ratings.forEach(r => {
        s = s + Number(r);
      });
      
      return Math.floor(s / folge.ratings.length * 10) / 10;
    }
    
    try {
      const folge = await Folge.findOne({ number: req.params.number });
      console.log(folge);
      folge.ratings.push(req.body.rating);
      folge.rating = getRating(folge);
  
      folge.save()
      .then(() => {
        res.redirect(`/folge/${req.params.number}`)
      })
      .catch(err => console.log(err));
  
    } catch (err) {
      console.log(err);
    }
  });

module.exports = router;