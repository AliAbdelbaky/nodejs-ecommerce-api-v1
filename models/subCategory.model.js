const mongoose = require('mongoose');

const SubCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: [true, 'Sub category required'],
        minLength: [2, 'to short sub category name'],
        maxLength: [32, 'Too long sub category name'],
    },
    slug: {
        type: String,
        lowercase: true
    },
    category: {
        type: mongoose.Schema.ObjectId,
        required: [true, 'SubCategory must be belong to parent category'],
        ref: 'Category'
    }

}, { timestamps: true })


module.exports = mongoose.model('SubCategory', SubCategorySchema)