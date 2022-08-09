const router = require('express').Router();
const { getLogin } = require('../controller/loginController')
router.get('/', getLogin)

module.exports = router