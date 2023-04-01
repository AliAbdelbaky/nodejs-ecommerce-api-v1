const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        minlength: [3, 'Too short Product Title'],
        maxlength: [100, 'Too long Product Title']
    },
    slug: {
        type: String,
        required: true,
        lowercase: true,
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        minlength: [10, 'Too short Product Description'],
        maxlength: [100, 'Too long Product Description']
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
    },
    sold: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        trim: true,
        maxlength: [100, 'Too long Product Price']
    },
    price_discount: {
        type: Number,
    },
    colors: [String],
    image: {
        type: String,
        required: [true, 'Image is required']
    },
    galary: [String],
    rating: {
        type: Number,
        default: 0,
        min: [0, ' rating must be greater than or equal to 0'],
        max: [5, ' rating must be lower than or equal to 5']
    },
    rating_quantity: {
        type: Number,
        default: 0,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Category is required']
    },
    subcategory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subcategory',
    }],
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand',
    },

}, { timestamps: true })

module.exports = mongoose.model('Product', productSchema)