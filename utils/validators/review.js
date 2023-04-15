const { check } = require('express-validator')
const validatorMiddleware = require('../../middleware/validatorMiddleware')
const ReviewModel = require('../../models/review.model')

const createReviewsValidator = [
    check('description')
        .notEmpty()
        .withMessage('description is required')
        .isLength({ min: 3 })
        .withMessage('description must be at least 3 characters long')
        .isLength({ max: 150 })
        .withMessage('description must be less than 150 characters long'),
    check('ratings')
        .notEmpty()
        .withMessage('Ratings is required')
        .isFloat({ min: 1, max: 5 })
        .withMessage('Ratings must be between 1 and 5'),
    check('product')
        .notEmpty()
        .withMessage('Product is required')
        .isMongoId()
        .withMessage('Invalid Product id')
        .custom(async (value, { req }) => {
            const review = await ReviewModel.findOne({
                product: value,
                user: req.user._id
            })
            if (review) {
                return Promise.reject(new Error('Product already has a review'))
            }
            req.body.user = req.user._id
            return true
        })
    ,
    validatorMiddleware
]
const updateReviewsValidator = [
    check('id')
        .notEmpty()
        .withMessage('Reviews id is required')
        .isMongoId()
        .withMessage('Invalid Reviews id')
        .custom(async (value, { req }) => {
            const review = await ReviewModel.findById(value)
            if (!review) {
                return Promise.reject(new Error('Invalid Reviews id'))
            }
            if (review.user._id.toString() !== req.user._id.toString()) {
                return Promise.reject(new Error('Your are not allowed to perform this action'))
            }
            return true
        })
    ,
    check('description')
        .optional()
        .notEmpty()
        .withMessage('description is required')
        .isLength({ min: 3 })
        .withMessage('description must be at least 3 characters long')
        .isLength({ max: 150 })
        .withMessage('description must be less than 150 characters long'),
    check('ratings')
        .optional()
        .notEmpty()
        .withMessage('Ratings is required')
        .isFloat({ min: 1, max: 5 })
        .withMessage('Ratings must be between 1 and 5')
    , validatorMiddleware
]
const getReviewsValidator = [
    check('id')
        .notEmpty()
        .withMessage('Reviews id is required')
        .isMongoId()
        .withMessage('Invalid Reviews id'),
    validatorMiddleware
]
const deleteReviewsValidator = [
    check('id')
        .notEmpty()
        .withMessage('Reviews id is required')
        .isMongoId()
        .withMessage('Invalid id')
        .custom(async (value, { req }) => {
            if (req.user.role === 'user') {
                const review = await ReviewModel.findById(value)
                if (!review) {
                    return Promise.reject(new Error('Invalid Reviews id'))
                }
                if (review.user.toString() !== req.user._id.toString()) {
                    return Promise.reject(new Error('Your are not allowed to perform this action'))
                }
            }
            return true
        })
    ,
    validatorMiddleware
]

module.exports = {
    getReviewsValidator,
    createReviewsValidator,
    updateReviewsValidator,
    deleteReviewsValidator
}