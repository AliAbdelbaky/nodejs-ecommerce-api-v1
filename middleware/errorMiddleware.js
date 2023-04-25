const ApiError = require('../utils/apiError')

const errorMiddleware = (app) => {
    app.all('*', (req, res, next) => {
        next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400))
    })
    app.use((error, req, res, next) => {
        error.statusCode = error.statusCode || 500
        error.status = error.status || 'error'
        // eslint-disable-next-line no-use-before-define
        res.status(400).json(response(error))
    })
}
// const JwtError = () => 

const response = (error) => {
    // eslint-disable-next-line no-unused-expressions
    ['TokenExpiredError', 'JsonWebTokenError'].includes(error.name) ? error = new ApiError('Invalid Authentication Key', 401) : true

    let DEFUALT_RES = {
        status: error.status,
        message: error.message,
    }
    if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line prefer-object-spread
        DEFUALT_RES = Object.assign({ error, stack: error.stack }, DEFUALT_RES)
    }

    return DEFUALT_RES
}

module.exports = errorMiddleware