// const express = require('express')
import Express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import mongoose from 'mongoose';
dotenv.config({ path: "config.env" })

//- connect to DB
mongoose.connect(process.env.DB_URI).then((conn) => {
    console.log(`Database Connected: ${conn.connection.host}`)
}).catch((err) =>{
    console.error(err)
    process.exit(1)
})

//- express app
const app = Express();

//- Middlewares
app.use(Express.json())
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'))


app.get('/', (req, res) => {
    res.send({
        Hello: true
    })
})


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`App runing on http://localhost:${PORT}`)
})