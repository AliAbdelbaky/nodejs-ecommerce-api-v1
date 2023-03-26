// const express = require('express')
const express = require('express')
const dotenv = require('dotenv');

dotenv.config({ path: "config.env" })
//- connect to DB
const dbConnection = require('./config/database')
dbConnection()

//- express app
const app = express();

//- Middlewares
const initMiddleware = require('./middleware/index')
initMiddleware(app)



// initaite routes
const initRoutes = require('./routes/index')
initRoutes(app)


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`App runing on http://localhost:${PORT}`)
})