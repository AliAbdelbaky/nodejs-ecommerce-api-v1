const mongoose = require('mongoose')

const paymentTypes = ['card', 'cash']

const OrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Order must belong to user']
    },
    cartItems: [
        {
            product: {
                type: mongoose.Schema.ObjectId,
                ref: 'Product',
            },
            quantity: Number,
            color: String,
            price: Number,
        }
    ],
    taxPrice: {
        type: Number,
        default: 0
    },
    shippingAddress: {
        details: String,
        phone: String,
        city: String,
        postalCode: String,
    },
    shippingPrice: {
        type: Number,
        default: 0
    },
    price: Number,
    paymentType: {
        type: String,
        enum: paymentTypes,
        default: 'cash'
    },
    isPaied: {
        type: Boolean,
        default: false
    },
    paidAt: Date,
    isDelivered: {
        type: Boolean,
        default: false
    },
    deliverdAt: Date

}, { timestamps: true })

OrderSchema.pre(/^find/, function (next) {

    this.populate('cartItems.product')
    next()
})
module.exports = mongoose.model('Order', OrderSchema);

