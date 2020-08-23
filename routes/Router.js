const router = require('express').Router();

router.use('/folge', require('./folge'));
router.use('/auth', require('./auth'));
router.use('/user', require('./user'));

router.get('/scrapeFolge/:number', (req, res) => {
  const jobs = require('../jobs/scrapeFolgenDetails');
  jobs.scrapeFolge(req.params.number)
  .then(data => {
    res.json(data);
  })
  .catch(error => res.json(error));
});

router.get('/all', (req, res) => {
  const file = require('../albums.json');
  res.json(file);
});

module.exports = router;