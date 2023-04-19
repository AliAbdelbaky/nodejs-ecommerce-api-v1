const mongoose = require('mongoose')

const CouponSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name is required'],
        trim: true,
        unique: true
    },
    expires: {
        type: Date,
        required: [true, 'expired time is required']
    },
    discount: {
        type: Number,
        required: [true, 'discount is required'],
    }
}, { timestamps: true })

module.exports = mongoose.model('Coupon', CouponSchema);

