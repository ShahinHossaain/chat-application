// GET LOGIN PAGE
const getUser = (req, res, next) => {
    res.render("users")
}

module.exports = { getUser }