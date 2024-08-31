const createError = require('http-errors')

// 404 ERROR HANDLER
const notFoundHandler = (req, res, next) => {
    next(createError(404, 'Your requested content was not found'));
}

// DEFAULT ERROR HANDLER
const errorHandler = (err, req, res, next) => {

    res.locals.error = process.env.NODE_ENV === 'production' ? err : { message: err.message }

    res.status(err.status || 500)

    if (res.locals.html) {
        // HTML RESPONSE 
        res.render("error", { title: "Error page" })
    } else {
        // JSON RESPONSE
        res.json(res.locals.error)
    }




    // res.locals.title = "error hhh"
    // res.render('error')
    // or do -> res.render('error', {
    //     title: "Error page"
    // })

};

module.exports = { notFoundHandler, errorHandler }
