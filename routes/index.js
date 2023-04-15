const categoryRouter = require('./api/categoryRoute')
const subcategoryRouter = require('./api/subcategoryRoute')
const brandRoute = require('./api/brandRoute')
const productRoute = require('./api/productRoute')
const userRoute = require('./api/userRoute')
const authRoute = require('./api/authRoute')
const reviewRoute = require('./api/reviewRoute')

const baseName = process.env.BASE_ROUTE_NAME




const initRoutes = (app) => {
    app.get('/', (req, res) => {
        res.send({
            Hello: true
        })
    })
    app.use(`${baseName}/category`, categoryRouter)
    app.use(`${baseName}/subCategory`, subcategoryRouter)
    app.use(`${baseName}/brand`, brandRoute)
    app.use(`${baseName}/products`, productRoute)
    app.use(`${baseName}/user`, userRoute)
    app.use(`${baseName}/auth`, authRoute)
    app.use(`${baseName}/reviews`, reviewRoute)
}

module.exports = initRoutes