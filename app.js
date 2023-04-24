const path = require('path');
const stripe = require('stripe')(process.env.STRIPE_SECRET);

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
app.use(express.json())
app.use(express.static(path.join(__dirname, 'uploads')))
// allowing other domains to serve routes
app.use(cors())
app.options('*', cors())

// compress all responses
app.use(compression())

// checkout webhook
app.post('/webhook-checkout', express.raw({ type: 'application/json' }), (req, res) => {
    const sig = req.headers['stripe-signature'];


    let event;

    try {
        console.log('body =>',req.body);
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.WEBHOOK_SECRET);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
        console.log('create order here ......')
        // eslint-disable-next-line no-case-declarations
        const checkoutSessionCompleted = event.data.object;
        console.log(checkoutSessionCompleted)

    } else {
        console.log(`Unhandled event type ${event.type}`);

    }
    // Return a 200 res to acknowledge receipt of the event
    res.send();
});




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