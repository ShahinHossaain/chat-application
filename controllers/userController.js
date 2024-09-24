// EXTERNAL INPUTS
const bcrypt = require('bcrypt');
const { unlink } = require('fs');
const path = require('path');

// INTERNAL INPUTS
const User = require('../models/people');



// GET LOGIN PAGE
const getUser = async (req, res, next) => {
    try {
        const users = await User.find();
        res.render("users", {
            users
        })
    } catch (error) {
        next(error);
    }
}

// ADD USER
const addUser = async (req, res, next) => {
    let newUser;
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    if (req.files && req.files?.length > 0) {
        newUser = new User({
            ...req.body,
            avatar: req.files[0].filename,
            password: hashedPassword
        })
    } else {
        newUser = new User({
            ...req.body,
            password: hashedPassword
        });

    }

    // SAVE USER OR SEND ERROR
    try {
        const result = await newUser.save();

        res.status(200).json({
            message: "User saved successfully"
        })
    } catch (err) {
        res.status(500).json({
            errors: {
                common: {
                    msg: "Unknown error occurred!"
                }
            }
        })

    }
}

// DELETE USER
const removeUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete({
            _id: req.params.id,
        });

        // remove user avatar if any
        if (user.avatar) {
            unlink(
                path.join(__dirname, `/../public/uploads/avatars/${user.avatar}`),
                (err) => {
                    if (err) console.log(err);
                }
            );
        }

        res.status(200).json({
            message: "User was removed successfully!",
        });
    } catch (err) {
        res.status(500).json({
            errors: {
                common: {
                    msg: "Could not delete the user!",
                },
            },
        });
    }
}

module.exports = { getUser, addUser, removeUser }