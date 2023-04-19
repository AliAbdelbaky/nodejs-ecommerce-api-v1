const express = require('express')

const { protect, allowedTo } = require('../../services/auth')

const {
    getCoupon,
    getCouponsList,
    createCoupon,
    updateCoupon,
    deleteCoupon
} = require('../../services/coupon')

const {
    getCouponValidator,
    createCouponValidator,
    updateCouponValidator,
    deleteCouponValidator
} = require("../../utils/validators/coupon")

const router = express.Router()

router.use(protect, allowedTo('admin', 'manager'))

router
    .route('/')
    .get(getCouponsList)
    .post(createCouponValidator, createCoupon)
router
    .route('/:id')
    .get(getCouponValidator, getCoupon)
    .put(updateCouponValidator, updateCoupon)
    .delete(deleteCouponValidator, deleteCoupon)


module.exports = router