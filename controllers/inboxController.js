// external imports
const createError = require("http-errors");
// internal imports
const User = require("../models/People");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const escape = require("../utilities/escape");
// todo: changed
const moment = require('moment');

// get inbox page
async function getInbox(req, res, next) {
    try {
        const conversations = await Conversation.find({
            $or: [
                { "creator.id": req.user.userid },
                { "participant.id": req.user.userid },
            ],
        });
        res.locals.data = conversations;
        // todo: changed
        res.render("inbox", {
            moment: moment
        });
    } catch (err) {
        next(err);
    }
}

// search user
async function searchUser(req, res, next) {
    const user = req.body.user;
    const searchQuery = user.replace("+88", "");

    const name_search_regex = new RegExp(escape(searchQuery), "i");
    const mobile_search_regex = new RegExp("^" + escape("+88" + searchQuery));
    const email_search_regex = new RegExp("^" + escape(searchQuery) + "$", "i");

    console.log("form searchUser", name_search_regex, mobile_search_regex, email_search_regex)

    try {
        if (searchQuery !== "") {
            let users = await User.find(
                {
                    $or: [
                        {
                            name: name_search_regex,
                        },
                        {
                            mobile: mobile_search_regex,
                        },
                        {
                            email: email_search_regex,
                        },
                    ],
                },
                "name avatar"
            );
            console.log("User", users, res.locals.loggedInUser.userid);

            const loggedInUserId = res.locals.loggedInUser.userid;

            const conversationsOfLoggedInUser = await Conversation.find({
                $or: [
                    { "creator.id": loggedInUserId },
                    { "participant.id": loggedInUserId }
                ]
            });


            // console.log("coliu", conversationsOfLoggedInUser)

            conversationsOfLoggedInUser.forEach((conversation) => {


                const creatorId = conversation.creator.id.toString();
                const participantId = conversation.participant.id.toString();
                users.forEach((user) => {
                    users = users.filter(user => user.id !== creatorId && user.id !== participantId);
                });

            })
            console.log("Users", users)

            res.json(users);
        } else {
            throw createError("You must provide some text to search!");
        }
    } catch (err) {
        res.status(500).json({
            errors: {
                common: {
                    msg: err.message,
                },
            },
        });
    }
}

// add conversation
async function addConversation(req, res, next) {
    try {
        const newConversation = new Conversation({
            creator: {
                id: req.user.userid,
                name: req.user.username,
                avatar: req.user.avatar || null,
            },
            participant: {
                name: req.body.participant,
                id: req.body.id,
                avatar: req.body.avatar || null,
            },
        });

        const result = await newConversation.save();
        res.status(200).json({
            message: "Conversation was added successfully!",
        });
    } catch (err) {
        res.status(500).json({
            errors: {
                common: {
                    msg: err.message,
                },
            },
        });
    }
}

// get messages of a conversation
async function getMessages(req, res, next) {
    try {
        const messages = await Message.find({
            conversation_id: req.params.conversation_id,
        }).sort("-createdAt");

        const { participant } = await Conversation.findById(
            req.params.conversation_id
        );

        res.status(200).json({
            data: {
                messages: messages,
                participant,
            },
            user: req.user.userid,
            conversation_id: req.params.conversation_id,
        });
    } catch (err) {
        res.status(500).json({
            errors: {
                common: {
                    msg: "Unknows error occured!",
                },
            },
        });
    }
}

// send new message
async function sendMessage(req, res, next) {
    if (req.body.message || (req.files && req.files.length > 0)) {
        try {
            // save message text/attachment in database
            let attachments = null;

            if (req.files && req.files.length > 0) {
                attachments = [];

                req.files.forEach((file) => {
                    attachments.push(file.filename);
                });
            }

            const newMessage = new Message({
                text: req.body.message,
                attachment: attachments,
                sender: {
                    id: req.user.userid,
                    name: req.user.username,
                    avatar: req.user.avatar || null,
                },
                receiver: {
                    id: req.body.receiverId,
                    name: req.body.receiverName,
                    avatar: req.body.avatar || null,
                },
                conversation_id: req.body.conversationId,
            });

            const result = await newMessage.save();

            // emit socket event
            global.io.emit("new_message", {
                message: {
                    conversation_id: req.body.conversationId,
                    sender: {
                        id: req.user.userid,
                        name: req.user.username,
                        avatar: req.user.avatar || null,
                    },
                    message: req.body.message,
                    attachment: attachments,
                    date_time: result.date_time,
                },
            });

            res.status(200).json({
                message: "Successful!",
                data: result,
            });
        } catch (err) {
            res.status(500).json({
                errors: {
                    common: {
                        msg: err.message,
                    },
                },
            });
        }
    } else {
        res.status(500).json({
            errors: {
                common: "message text or attachment is required!",
            },
        });
    }
}

module.exports = {
    getInbox,
    searchUser,
    addConversation,
    getMessages,
    sendMessage,
};