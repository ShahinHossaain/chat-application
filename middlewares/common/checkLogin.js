const jwt = require("jsonwebtoken");

const checkLogin = (req, res, next) => {
    console.log("checkLogin called");
    let cookies =
        Object.keys(req.signedCookies).length > 0 ? req.signedCookies : null;

    if (cookies) {
        try {
            token = cookies[process.env.COOKIE_NAME];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            console.log("inside try")

            // pass user info to response locals
            if (res.locals.html) {
                res.locals.loggedInUser = decoded;
                console.log("inside res.locals.html")
            }
            next();
        } catch (err) {
            if (res.locals.html) {
                console.log("inside catch locals.html")
                res.redirect("/");
            } else {
                console.log("inside catch else")
                res.status(500).json({
                    errors: {
                        common: {
                            msg: "Authentication failure!",
                        },
                    },
                });
            }
        }
    } else {
        if (res.locals.html) {
            res.redirect("/");
        } else {
            res.status(401).json({
                error: "Authetication failure!",
            });
        }
    }
};

const redirectLoggedIn = function (req, res, next) {
    let cookies =
        Object.keys(req.signedCookies).length > 0 ? req.signedCookies : null;

    if (!cookies) {
        next();
    } else {
        res.redirect("/inbox");
    }
};

module.exports = {
    checkLogin,
    redirectLoggedIn
};