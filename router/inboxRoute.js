const router = require('express').Router();
const { getInbox } = require('../controller/inboxController')
router.get('/', getInbox)

module.exports = router