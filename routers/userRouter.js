// EXTERNAL IMPORT 
const express = require('express');


// INTERNAL IMPORT
const { getUser, addUser, removeUser } = require('../controllers/userController');
const decorateHtmlResponse = require('../middlewares/common/decorateHtmlResponse');
const avatarUpload = require('../middlewares/users/avatarUploads');
const { addUserValidators, addUserValidationHandler } = require('../middlewares/users/userValidators');
const People = require('../models/people');
const { checkLogin } = require('../middlewares/common/checkLogin');


const router = express.Router();

// USERS PAGE
router.get(
    "/",
    decorateHtmlResponse("Users"),
    checkLogin,
    getUser);

// ADD USER 
router.post(
    "/",
    checkLogin,
    avatarUpload,
    addUserValidators,
    addUserValidationHandler,
    addUser)

// REMOVE USER
router.delete("/:id", removeUser);

module.exports = router; 