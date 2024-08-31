// GET LOGIN PAGE
const getLogin = (req, res, next) => {
    res.render("index", {
        title: "Login -Chat Application"
    })
}

module.exports = { getLogin }