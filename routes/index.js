const categoryRouter = require('./categoryRoute')
const baseName = process.env.BASE_ROUTE_NAME
const apiError = require('../middleware/apiError')



const initRoutes = (app) => {
    app.get('/', (req, res) => {
        res.send({
            Hello: true
        })
    })
    app.use(`${baseName}/category`, categoryRouter)

    apiError(app)
}

module.exports = initRoutes