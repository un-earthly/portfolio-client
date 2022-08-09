var createError = require('http-errors');

const notFoundHandler = (req, res, next) => {
    next(createError(404, "Requested content not found!"))
}

const errorHandler = (err, req, res, next) => {
    res.status(err.status || 500)
    if (res.locals.html) {
        res.render('err', {
            title: "Page Error"
        })
    }

    else {
        res.json(err)
    }
}

module.exports = { errorHandler, notFoundHandler }