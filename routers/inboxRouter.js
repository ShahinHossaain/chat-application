// EXTERNAL IMPORT 
const express = require('express');
const { getInbox } = require('../controllers/inboxController');
const decorateHtmlResponse = require('../middlewares/common/decorateHtmlResponse');

// INTERNAL IMPORT


const router = express.Router();

// LOGIN PAGE
router.get("/", decorateHtmlResponse("Inbox"), getInbox);

module.exports = router;