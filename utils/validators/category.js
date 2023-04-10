const slugify = require('slugify');

const { check } = require('express-validator')
const validatorMiddleware = require('../../middleware/validatorMiddleware')


exports.getCategoryValidator = [
    check('id')
        .isMongoId()
        .withMessage('Invalid category id'),
    validatorMiddleware
]


exports.createCategoryValidator = [
    check('name')
        .notEmpty()
        .withMessage('category name is required')
        .isLength({ min: 3 })
        .withMessage('Too short name')
        .isLength({ max: 32 })
        .withMessage('Too long name')
        .custom((value, { req }) => {
            req.body.slug = slugify(value)
            return true
        })
    ,
    check('image')
        .notEmpty()
        .withMessage('image is required')
    ,
    validatorMiddleware
]
exports.updateCategoryValidator = [
    check('id')
        .isMongoId()
        .withMessage('Invalid category id'),
    check('name')
        .optional()
        .notEmpty()
        .withMessage('category name is required')
        .isLength({ min: 3 })
        .withMessage('Too short name')
        .isLength({ max: 32 })
        .withMessage('Too long name')
        .custom((value, { req }) => {
            req.body.slug = slugify(value)
            return true
        }),
    check('image')
        .optional()
        .notEmpty()
        .withMessage('image is required')
    ,
    validatorMiddleware
]
exports.deleteCategoryValidator = [
    check('id')
        .isMongoId()
        .withMessage('Invalid category id'),
    validatorMiddleware
]