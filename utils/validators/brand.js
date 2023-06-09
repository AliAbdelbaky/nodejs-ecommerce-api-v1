const slugify = require('slugify');

const { check } = require('express-validator')
const validatorMiddleware = require('../../middleware/validatorMiddleware')

const getBrandValidator = [
    check('id')
        .notEmpty()
        .withMessage('brand id is required')
        .isMongoId()
        .withMessage('Invalid brand id'),
    validatorMiddleware
]
const createBrandValidator = [
    check('name')
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 3 })
        .withMessage('Name must be at least 3 characters long')
        .isLength({ max: 32 })
        .withMessage('Name must be less than 32 characters long')
        .custom((value, { req }) => {
            req.body.slug = slugify(value)
            return true
        })
    ,
    check('image')
        .notEmpty()
        .withMessage('Image is required')
        .isString()
        .withMessage('Image must be a string')
    ,
    validatorMiddleware
]
const updateBrandValidator = [
    check('id')
        .notEmpty()
        .withMessage('brand id is required')
        .isMongoId()
        .withMessage('Invalid brand id'),
    check('name')
        .optional()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 3 })
        .withMessage('Name must be at least 3 characters long')
        .isLength({ max: 32 })
        .withMessage('Name must be less than 32 characters long')
        .custom((value, { req }) => {
            req.body.slug = slugify(value)
            return true
        })
    ,
    check('image')
        .optional()
        .notEmpty()
        .withMessage('Image is required')
        .isString()
        .withMessage('Image must be a string'),
    validatorMiddleware
]
const deleteBrandValidator = [
    check('id')
        .notEmpty()
        .withMessage('brand id is required')
        .isMongoId()
        .withMessage('Invalid id'),
    validatorMiddleware
]

module.exports = {
    getBrandValidator,
    createBrandValidator,
    updateBrandValidator,
    deleteBrandValidator
}