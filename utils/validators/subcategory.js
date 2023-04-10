const slugify = require('slugify');
const { check } = require('express-validator')
const validatorMiddleware = require('../../middleware/validatorMiddleware')

exports.createSubCategoryValidator = [
    check('name')
        .notEmpty()
        .withMessage('Sub category name is required')
        .isLength({ min: 2 })
        .withMessage('Too short name')
        .isLength({ max: 32 })
        .withMessage('Too long name'),
    check('category')
        .notEmpty()
        .withMessage('category is required')
        .isMongoId()
        .withMessage('invalid category id format'),
    validatorMiddleware
]

exports.getSubCategoryValidator = [
    check('id')
        .notEmpty()
        .withMessage('Sub category id is required')
        .isMongoId()
        .withMessage('Invalid category id'),
    validatorMiddleware
]

exports.updateSubCategoryValidator = [
    check('id')
        .notEmpty()
        .withMessage('Sub category id is required')
        .isMongoId()
        .withMessage('Invalid category id'),
    check('category')
        .optional()
        .isMongoId()
        .withMessage('invalid category id format'),
    check('name')
        .optional()
        .isLength({ min: 2 })
        .withMessage('Too short name')
        .isLength({ max: 32 })
        .withMessage('Too long name')
        .custom((value, { req }) => {
            req.body.slug = slugify(value)
            return true
        })
        ,
    validatorMiddleware
]

exports.deleteSubCategoryValidator = [
    check('id')
        .notEmpty()
        .withMessage('Sub category id is required')
        .isMongoId()
        .withMessage('Invalid category id'),
    validatorMiddleware
]
