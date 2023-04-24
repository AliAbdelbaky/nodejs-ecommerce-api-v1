const path = require('path');

require('colors')
const express = require('express')
const dotenv = require('dotenv');
const morgan = require('morgan');
// eslint-disable-next-line import/no-extraneous-dependencies
const cors = require('cors');
// eslint-disable-next-line import/no-extraneous-dependencies
const compression = require('compression')
const { webhookCheckout } = require('./services/order')

dotenv.config({ path: ".env" })
//- connect to DB
const dbConnection = require('./config/database')

dbConnection()

//- express app
const app = express();
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'))
app.use(express.static(path.join(__dirname, 'uploads')))
// allowing other domains to serve routes
app.use(cors())
app.options('*', cors())

// compress all responses
app.use(compression())

// checkout webhook
app.post('/webhook-checkout', express.raw({ type: 'application/json' }), webhookCheckout)

app.use(express.json())




// initaite routes
const initRoutes = require('./routes/index')

initRoutes(app)


//- Middlewares
const errorMiddleware = require('./middleware/errorMiddleware')

errorMiddleware(app)


// initalize server
const { PORT } = process.env

const server = app.listen(PORT, () => {
    console.log(`Server running ✅✅`.grey, `http://localhost:${PORT}`.underline.blue)
})


// handel rejection outside express
process.on('unhandledRejection', (error) => {
    server.close(() => {
        console.error(`unhandledRejection error: ${error.name} | ${error.message}`)
        process.exit(1)
    })
})