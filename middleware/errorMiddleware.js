const ApiError = require('../utils/apiError')
const apiError = (app) => {
    app.all('*', (req, res, next) => {
        next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400))
    })
    app.use((error, req, res, next) => {
        error.statusCode = error.statusCode || 500
        error.status = error.status || 'error'

        if (process.env.NODE_ENV === 'development') {
            sendForDev(error, res)
        } else {
            sendForProd(error, res)
        }
    })
}
const sendForProd = (error, res) => {
    return res.status(400).json({
        status: error.status,
        message: error.message,
    })
}
const sendForDev = (error, res) => {
    return res.status(400).json({
        status: error.status,
        error,
        message: error.message,
        stack: error.stack
    })
}
module.exports = apiError