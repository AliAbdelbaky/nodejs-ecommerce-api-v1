const slugify = require('slugify');

const { check } = require('express-validator')
const validatorMiddleware = require('../../middleware/validatorMiddleware')
const Coupon = require('../../models/coupon.model')

const getCouponValidator = [
    check('id')
        .notEmpty()
        .withMessage('Coupon id is required')
        .isMongoId()
        .withMessage('Invalid Coupon id'),
    validatorMiddleware
]
const createCouponValidator = [
    check('name')
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 3 })
        .withMessage('Name must be at least 3 characters long')
        .isLength({ max: 32 })
        .withMessage('Name must be less than 32 characters long')
        .custom(async (value) => {
            const coupon = await Coupon.findOne({ name: value })
            if (coupon) {
                return Promise.reject(new Error('Coupon is already available'))
            }
            return true
        }),
    check('expires')
        .notEmpty()
        .withMessage('expires field is required')
        .custom((value, { req }) => {
            const date = new Date(value)
            const isValid = date instanceof Date && !isNaN(date)
            if (!isValid) {
                return Promise.reject(new Error('Invalid expires date'))
            }
            req.expires = date
            return true
        })

    ,
    check('discount')
        .notEmpty()
        .withMessage('discount field is required')
        .isFloat({ min: 1 })
        .withMessage('discount field must be a number and greater than 1')
    ,
    validatorMiddleware
]
const updateCouponValidator = [
    check('name')
        .optional()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 3 })
        .withMessage('Name must be at least 3 characters long')
        .isLength({ max: 32 })
        .withMessage('Name must be less than 32 characters long')
    ,
    check('expires')
        .optional()
        .notEmpty()
        .withMessage('expires field is required')
        .custom((value, { req }) => {
            const date = new Date(value)
            const isValid = date instanceof Date && !isNaN(date)
            if (!isValid) {
                return Promise.reject(new Error('Invalid expires date'))
            }
            req.expires = date
            return true
        })

    ,
    check('discount')
        .optional()
        .notEmpty()
        .withMessage('discount field is required')
        .isFloat({ min: 1 })
        .withMessage('discount field must be a number and greater than 1')
    ,
    validatorMiddleware
]
const deleteCouponValidator = [
    check('id')
        .notEmpty()
        .withMessage('Coupon id is required')
        .isMongoId()
        .withMessage('Invalid id'),
    validatorMiddleware
]

module.exports = {
    getCouponValidator,
    createCouponValidator,
    updateCouponValidator,
    deleteCouponValidator
}