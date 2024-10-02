// EXTERNAL INPUTS
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const createError = require("http-errors");

// INTERNAL INPUTS
const User = require("../models/people");

// GET LOGIN PAGE
const getLogin = (req, res, next) => {
    res.render("index")
}

// DO LOGIN
const login = async (req, res, next) => {
    try {
        // FIND A USER WHO HAS THIS EMAIL/USERNAME
        const user = await User.findOne(
            {
                $or: [
                    { email: req.body.username },
                    { mobile: req.body.username }
                ]
            })

        if (user && user._id) {
            const isValidPassword = await bcrypt.compare(
                req.body.password,
                user.password
            )

            if (isValidPassword) {
                // PREPARE THE USER OBJECT TO GENERATE TOKEN.
                const userObject = {
                    username: user.name,
                    mobile: user.mobile,
                    email: user.email,
                    role: "user"
                }

                // GENERATE TOKEN
                const token = jwt.sign(userObject, process.env.JWT_secret, {
                    expiresIn: process.env.JWT_EXPIRY
                });

                // SET COOKIES
                res.cookie(process.env.COOKIE_NAME, token, {
                    maxAge: process.env.JWT_EXPIRY,
                    httpOnly: true,
                    signed: true
                });

                //SET LOGGED IN USER LOCAL IDENTIFIER
                res.locals.loggedInUser = userObject;

                res.render("inbox");
            } else {
                throw createError("Login failed! Please try again.");
            }
        } else {
            throw createError("Login failed! Please try again..");
        }
    } catch (error) {
        res.render("index", {
            data: {
                username: req.body.username,
            },
            errors: {
                common: {
                    msg: error.message,
                }
            }
        })
    }
}

// DO LOGOUT
const logout = (req, res) => {
    res.clearCookie(process.env.COOKIE_NAME);
    res.send("Logged out");
};

module.exports = { getLogin, login, logout };