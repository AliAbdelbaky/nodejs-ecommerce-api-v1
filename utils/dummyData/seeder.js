const fs = require('fs')
const dotenv = require('dotenv')
const Product = require('../../models/product.model')
// eslint-disable-next-line import/no-extraneous-dependencies
require('colors')
const dbConnection = require('../../config/database')

dotenv.config({ path: "./.env" })

dbConnection()


const products = JSON.parse(fs.readFileSync('./utils/dummyData/products.json'))

const insertData = async () => {
    try {
        await Product.create(products)
        console.log('Data Inserted ✅✅'.underline.green)
        process.exit()
    } catch (err) {
        console.log(err)
    }
}

const distroyData = async () => { // npm run seed:i||d
    try {
        await Product.deleteMany()
        console.log('Data Deleted ✔️✔️'.underline.red)
        process.exit()
    } catch (err) {
        console.log(err)
    }
}
if (process.argv[2] === '-i') {
    insertData()
} else if (process.argv[2] === '-d') {
    distroyData()
}