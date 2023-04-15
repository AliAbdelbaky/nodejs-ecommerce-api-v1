const slugify = require('slugify');

const { check } = require('express-validator')
const validatorMiddleware = require('../../middleware/validatorMiddleware')

// const getReviewsValidator = [
//     check('id')
//         .notEmpty()
//         .withMessage('Reviews id is required')
//         .isMongoId()
//         .withMessage('Invalid Reviews id'),
//     validatorMiddleware
// ]
const createReviewsValidator = [
    check('description')
        .notEmpty()
        .withMessage('description is required')
        .isLength({ min: 3 })
        .withMessage('description must be at least 3 characters long')
        .isLength({ max: 100 })
        .withMessage('description must be less than 100 characters long'),
    check('ratings')
        .notEmpty()
        .withMessage('Ratings is required')
        .isNumeric({ min: 1, max: 5 })
        .withMessage('Ratings must be between 1 and 5')
        .custom((value, { req }) => {
            req.body.user = req.user._id
            return true
        })
    ,
    validatorMiddleware
]
// const updateReviewsValidator = [
//     check('id')
//         .notEmpty()
//         .withMessage('Reviews id is required')
//         .isMongoId()
//         .withMessage('Invalid Reviews id'),
//     check('name')
//         .optional()
//         .notEmpty()
//         .withMessage('Name is required')
//         .isLength({ min: 3 })
//         .withMessage('Name must be at least 3 characters long')
//         .isLength({ max: 32 })
//         .withMessage('Name must be less than 32 characters long')
//         .custom((value, { req }) => {
//             req.body.slug = slugify(value)
//             return true
//         })
//     ,
//     check('image')
//         .optional()
//         .notEmpty()
//         .withMessage('Image is required')
//         .isString()
//         .withMessage('Image must be a string'),
//     validatorMiddleware
// ]
// const deleteReviewsValidator = [
//     check('id')
//         .notEmpty()
//         .withMessage('Reviews id is required')
//         .isMongoId()
//         .withMessage('Invalid id'),
//     validatorMiddleware
// ]

module.exports = {
    // getReviewsValidator,
    createReviewsValidator,
    // updateReviewsValidator,
    // deleteReviewsValidator
}