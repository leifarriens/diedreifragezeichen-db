const router = require('express').Router();
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
      const folge = await Folge.findOne({ number: req.params.number });
      res.render('folge', folge);
    } catch (err) {
      console.log(err);
      res.render('404');
    }
  });

router.route('/:number/rate')

  .post(async (req, res) => {

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