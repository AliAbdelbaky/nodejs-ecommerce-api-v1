const express = require('express')
const dotenv = require('dotenv');
const morgan = require('morgan');

dotenv.config({ path: ".env" })
//- connect to DB
const dbConnection = require('./config/database')
dbConnection()

//- express app
const app = express();


if (process.env.NODE_ENV === 'development') app.use(morgan('dev'))

app.use(express.json())




// initaite routes
const initRoutes = require('./routes/index')
initRoutes(app)


//- Middlewares
const errorMiddleware = require('./middleware/errorMiddleware')
errorMiddleware(app)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`App runing on http://localhost:${PORT}`)
})