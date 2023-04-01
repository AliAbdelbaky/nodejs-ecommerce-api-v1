const categoryRouter = require('./categoryRoute')
const subcategoryRouter = require('./subcategoryRoute')


const baseName = process.env.BASE_ROUTE_NAME




const initRoutes = (app) => {
    app.get('/', (req, res) => {
        res.send({
            Hello: true
        })
    })
    app.use(`${baseName}/category`, categoryRouter)
    app.use(`${baseName}/subCategory`, subcategoryRouter)
}

module.exports = initRoutes