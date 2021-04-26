const router = require('express').Router()

router.use('/folgen', require('./folge'))
router.use('/auth', require('./auth'))
router.use('/user', require('./user'))

module.exports = router
