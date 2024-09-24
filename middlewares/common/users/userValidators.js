// EXTERNAL INPUTS
const { check, validationResult } = require("express-validator");
const createError = require("http-errors");
const { unlink } = require("fs");
const path = require("path");

// INTERNAL INPUTS
const User = require("../../../models/people");

// ADD USER
const addUserValidators = [
    check("name")
        .isLength({ min: 1 })
        .withMessage("Name is required")
        .isAlpha("en-US", { ignore: " -" })
        .withMessage("Use only alphabet.")
        .trim(),
    check("email")
        .isEmail()
        .withMessage("Invalid email address")
        .trim()
        .custom(async (value) => {
            try {
                const user = await User.findOne({ email: value });
                if (user) {
                    throw createError("Email is already in use");
                }
            } catch (err) {
                throw createError(err.message);
            }
        }),
    check("mobile")
        .isMobilePhone("bn-BD", {
            strictMode: true,
        })
        .withMessage("Mobile number must be a valid Bangladeshi mobile number.")
        .custom(async (value) => {
            try {
                const user = await User.findOne({ mobile: value });
                if (user) {
                    throw createError("Mobile number already used");
                }
            } catch (err) {
                throw createError(err.message);
            }
        }),
    check("password")
        .isStrongPassword()
        .withMessage("Password must be at least 8 characters long and should contain 1 lowercase, 1 uppercase, 1 number and 1 symbol.")

];

const addUserValidationHandler = (req, res, next) => {

    const error = validationResult(req);


    let mappedErrors = error.mapped();




    if (Object.keys(mappedErrors)?.length === 0) {
        next();
    } else {
        // REMOVE UPLOADED FILE
        if (req.files?.length > 0) {
            const { filename } = req.files[0];
            unlink(
                path.join(__dirname, `/../public/uploads/avatars/${filename}`),
                (err) => {
                    if (err) console.log(err)
                }
            )
        }
        // RESPONSE THE ERROR
        res.status(500).json({
            errors: mappedErrors,
        })
    }
}

module.exports = {
    addUserValidators,
    addUserValidationHandler
};

