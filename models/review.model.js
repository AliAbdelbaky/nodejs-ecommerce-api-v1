const mongoose = require('mongoose');
const ProductModel = require('./product.model')

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
    next()
})

reviewSchema.statics.calc_avg_qq_ratings = async function (productId) {
    const result = await this.aggregate([
        // Stage 1: get all reviews in the product
        { $match: { product: productId } },
        // Stage 2: grouping all reviews based on product id and calculate avg && quantity
        {
            $group: {
                _id: 'product',
                avgRatings: { $avg: '$ratings' },
                ratingsQuantity: { $sum: 1 }
            }
        }
    ])
    if (result.length) {
        await ProductModel.findByIdAndUpdate({ _id: productId }, {
            ratingAvarage: result[0].avgRatings,
            ratingQuantity: result[0].ratingsQuantity,
        })
    } else {
        await ProductModel.findByIdAndUpdate({ _id: productId }, {
            ratingAvarage: 0,
            ratingQuantity: 0,
        })
    }
}
reviewSchema.post('save', function () {
    this.constructor.calc_avg_qq_ratings(this.product)
})
reviewSchema.post('remove', function () {
    this.constructor.calc_avg_qq_ratings(this.product)
})

module.exports = mongoose.model('Review', reviewSchema);