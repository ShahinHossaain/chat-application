// EXTERNAL IMPORT 
const express = require('express');

// INTERNAL IMPORT
const { getLogin } = require('../controllers/loginController');

const router = express.Router();

// LOGIN PAGE
router.get("/", getLogin);

module.exports = router;