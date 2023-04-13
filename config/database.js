const mongoose = require('mongoose');

const dbConnection = () => {
    const URI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}/${process.env.DB_NAME}?retryWrites=true&w=majority`
    mongoose
        .connect(URI).then((conn) => {
            console.log(`Database Connected: ${conn.connection.host}`)
        })
}
module.exports = dbConnection
