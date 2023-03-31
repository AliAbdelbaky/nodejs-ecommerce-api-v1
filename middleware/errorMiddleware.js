const ApiError = require('../utils/apiError')
const apiError = (app) => {
    app.all('*', (req, res, next) => {
        next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400))
    })
    app.use((error, req, res, next) => {
        error.statusCode = error.statusCode || 500
        error.status = error.status || 'error'
        res.status(400).json(response(error))
    })
}
const response = (error) => {
    let DEFUALT_RES = {
        status: error.status,
        message: error.message,
    }
    if (process.env.NODE_ENV === 'development') {
        DEFUALT_RES = Object.assign({ error, stack: error.stack }, DEFUALT_RES)
    }

    return DEFUALT_RES
}
module.exports = apiError