const router = require('express').Router();

const { verifyToken } = require('../middleware');
const { loadFolge, addFolgenRating, getPreviousFolgen, getNextFolgen, loadAllFolgen } = require('../services/folge');

router.get('/', async (req, res) => {
  try {
    const alle = await loadAllFolgen();
    res.json(alle);
  } catch (e) {
    console.log(e.message);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const folge = await loadFolge(req.params.id);
    console.log(folge);
    // const prevFolge = await getPreviousFolge(req.params.id);
    // const nextFolge = await getNextFolge(req.params.id);
    folge.rating = folge.ratings.reduce((a, b) => Number(a) + Number(b), 0) / folge.ratings.length;
    res.json(folge);
  } catch(e) {
    console.log(e);
    res.status(404).json({ lel:'hi'});
  }
});

router.get('/:id/alt', async (req, res) => {
  try {
    const currentFolge = await loadFolge(req.params.id);
    const previousFolge = await getPreviousFolgen(req.params.id);
    const nextFolge = await getNextFolgen(req.params.id);
    res.json([...previousFolge, currentFolge, ...nextFolge]);
  } catch (e) {
    console.log(e.message);
    res.sendStatus(404);
  }
})

router.post('/:id/rating', async (req, res) => {
  const IP = req.headers['x-forwarded-for'] || 
    req.connection.remoteAddress || 
    req.socket.remoteAddress ||
    (req.connection.socket ? req.connection.socket.remoteAddress : null);
  console.log(IP);
  try {
    const rating = Number(req.body.rating);
    console.log(rating);
    await addFolgenRating(req.params.id, rating);
    console.log('done');
    res.send('Rating saved!');
    // res.redirect(`/folge/${req.params.id}`);
  } catch (e) {
    console.log(e.message);
  }
});

module.exports = router;