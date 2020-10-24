const router = require('express').Router();

const { loadAllFolgen } = require('../services/folge');

  // router.get('/', async (req, res) => {
  //   try {
  //     const folgen = await loadAllFolgen();
  //     res.render('index', { folgen, user: req.user });
  //   } catch (e) {
  //     console.log(e);
  //   }
  // });

router.use('/folge', require('./folge'));

module.exports = router;