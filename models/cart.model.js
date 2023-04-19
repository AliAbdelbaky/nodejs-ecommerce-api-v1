const mongoose = require('mongoose')

const CartSchema = new mongoose.Schema({
    cartItems: [
        {
            product: {
                type: mongoose.Schema.ObjectId,
                ref: 'Product',
            },
            quantity: {
                type: Number,
                default: 1
            },
            color: String,
            price: Number,
        }
    ],
    totalPrice: Number,
    totalPriceAfterDiscount: Number,
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    }
}, { timestamps: true })
CartSchema.pre(/^find/, function (next) {

    this.populate('cartItems.product')
    next()
})
module.exports = mongoose.model('Cart', CartSchema);

