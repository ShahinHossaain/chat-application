// EXTERNAL IMPORT 
const express = require('express');

// INTERNAL IMPORT
const { getLogin } = require('../controllers/loginController');
const decorateHtmlResponse = require('../middlewares/common/decorateHtmlResponse');

const router = express.Router();

// LOGIN PAGE
router.get("/", decorateHtmlResponse("Login"), getLogin);

module.exports = router;