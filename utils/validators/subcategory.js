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
        .withMessage('Too long name')
        .custom((value, { req }) => {
            req.body.slug = slugify(value)
            return true
        })
    ,
    check('category')
        .optional()
        .custom((value, { req }) => {
            req.body.category = value
            return true
        })
        .isMongoId()
        .withMessage('invalid category id format')
    ,
    check('categoryId')
        .optional()
        .isMongoId()
        .withMessage('invalid category id format')
        .custom((value, { req }) => {
            req.body.category = value
            return true
        })
    ,
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
exports.getSubCategoriesValidator = [
    check('categoryId')
        .optional()
        .isMongoId()
        .withMessage('invalid category id format')
        .custom((val, { req }) => {
            console.log('val', val)
            req.filterObj = { category: val }
            return true
            // if (!val) req.body.category = req.params.categoryId
        }),
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
