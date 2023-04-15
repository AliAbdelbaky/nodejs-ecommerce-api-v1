const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    ratings: {
        type: Number,
        required: true,
        min: [1, ' Min rating is 1.0'],
        max: [5, ' Max rating is 5.0']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, ' Review must belong to user']
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: [true, 'Review must belong to product']
    }
}, { timestamps: true });

// Mongoose Query Middleware
reviewSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: 'name'
    })
    // this.populate({
    //     path: 'product',
    //     select: 'title'
    // })
    next()
})

module.exports = mongoose.model('Review', reviewSchema);