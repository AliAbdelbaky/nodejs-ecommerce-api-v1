const categoryRouter = require('./categoryRoute')

const initRoutes = (app) => {
    app.get('/', (req, res) => {
        res.send({
            Hello: true
        })
    })
    app.use('api/v1/category', categoryRouter)
}

module.exports = initRoutes