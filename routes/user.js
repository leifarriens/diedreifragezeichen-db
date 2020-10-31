const router = require('express').Router();

const { verifyToken } = require('../middleware');
const { loadUser, addFolgeToUserList } = require('../services/user');

router.get('/:id', async (req, res) => {
  try {
    const user = await loadUser(req.params.id);
    res.json(user);
  } catch (e) {
    console.log(e.message);
    res.sendStatus(404);
  }
});

router.post('/:id/list', async (req, res) => {
  try {
    await addFolgeToUserList(req.params.id, req.body);
    res.json('added to list');
  } catch(e) {
    console.log(e.message);
    res.sendStatus(404);
  }
});

module.exports = router;