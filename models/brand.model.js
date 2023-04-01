const mongoose = require('mongoose')

const BrandScheme = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: [true, 'Category required'],
        minLength: [3, 'to short category name'],
        maxLength: [32, 'Too long category name'],
    },
    slug: {
        type: String,
        lowercase: true
    },
    image: String
}, { timestamps: true })


module.exports = mongoose.model('Brand', BrandScheme);