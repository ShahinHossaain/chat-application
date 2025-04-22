// EXTERNAL IMPORT 
const express = require('express');

// INTERNAL IMPORT
const { getLogin, login, logout } = require('../controllers/loginController');
const decorateHtmlResponse = require('../middlewares/common/decorateHtmlResponse');
const { doLoginValidators, doLoginValidationHandler } = require('../middlewares/login/loginValidators');
const { redirectLoggedIn } = require('../middlewares/common/checkLogin');


const router = express.Router();

const pageTitle = "Login"



// LOGIN PAGE
router.get("/",
    decorateHtmlResponse(pageTitle),
    redirectLoggedIn,
    getLogin);

// PROCESS LOGIN
router.post(
    "/",
    decorateHtmlResponse(pageTitle),
    doLoginValidators,
    doLoginValidationHandler,
    login
);

//LOGOUT
router.delete("/", logout);


module.exports = router;