const factory = require('../utils/handlersFactory')
const Coupon = require('../models/coupon.model');


// @desc    Get list of coupons
// @route   GET /api/v1/coupons
// @access  Private/Admin-manager
const getCouponsList = factory.getAll(Coupon)

// @desc    Get specific coupon by id
// @route   GET /api/v1/coupons/:id
// @access  Private/Admin-manager
const getCoupon = factory.getOne(Coupon)

// @desc    Create coupon
// @route   POST  /api/v1/coupons
// @access  Private/Admin-manager
const createCoupon = factory.createOne(Coupon)

// @desc    Update specific coupon
// @route   PUT /api/v1/coupons/:id
// @access  Private/Admin-manager
const updateCoupon = factory.updateOne(Coupon)

// @desc    Delete specific Coupon
// @route   DELETE /api/v1/coupons/:id
// @access  Private/Admin-manager
const deleteCoupon = factory.deleteOne(Coupon)

module.exports = {
    getCoupon,
    getCouponsList,
    createCoupon,
    updateCoupon,
    deleteCoupon
}
