const express = require('express')
const logger = require('./loggerMiddelware')
const initMiddleware = (app) => {
    app.use(express.json())
    logger(app)
}

module.exports = initMiddleware