// EXTERNAL IMPORT 
const express = require('express');


// INTERNAL IMPORT
const { getUser, addUser, removeUser } = require('../controllers/userController');
const decorateHtmlResponse = require('../middlewares/common/decorateHtmlResponse');
const avatarUpload = require('../middlewares/common/users/avatarUploads');
const { addUserValidators, addUserValidationHandler } = require('../middlewares/common/users/userValidators');
const People = require('../models/people');


const router = express.Router();

// USERS PAGE
router.get(
    "/",
    decorateHtmlResponse("Users"),
    getUser);

// ADD USER 
router.post(
    "/",
    avatarUpload,
    addUserValidators,
    addUserValidationHandler,
    addUser)

// REMOVE USER
router.delete("/:id", removeUser);

module.exports = router; 