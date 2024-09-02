// EXTERNAL IMPORT 
const express = require('express');

// INTERNAL IMPORT

const { getUser } = require('../controllers/userController');
const decorateHtmlResponse = require('../middlewares/common/decorateHtmlResponse');


const router = express.Router();

// LOGIN PAGE
router.get("/", decorateHtmlResponse("Users"), getUser);

module.exports = router;