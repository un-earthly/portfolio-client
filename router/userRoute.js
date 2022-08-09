const router = require('express').Router();
const { getUsers } = require('../controller/usersController')
router.get('/', getUsers)

module.exports = router