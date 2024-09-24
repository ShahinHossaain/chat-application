// EXTERNAL INPUTS
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

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

                const token = jwt.sign()
            } else {

            }
        } else {

        }
    } catch (error) {

    }
}

module.exports = { getLogin }