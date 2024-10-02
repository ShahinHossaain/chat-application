// EXTERNAL IMPORT 
const express = require('express');
const { getInbox } = require('../controllers/inboxController');
const decorateHtmlResponse = require('../middlewares/common/decorateHtmlResponse');

// INTERNAL IMPORT
const { checkLogin } = require('../middlewares/common/checkLogin');


const router = express.Router();

// LOGIN PAGE
router.get("/", decorateHtmlResponse("Inbox"), checkLogin, getInbox);

module.exports = router;