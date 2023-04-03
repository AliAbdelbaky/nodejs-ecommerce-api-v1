const { check } = require('express-validator')
const validatorMiddleware = require('../../middleware/validatorMiddleware')

const getProductValidator = [
    check('id')
        .notEmpty()
        .withMessage('Product id is required')
        .isMongoId()
        .withMessage('Invalid Product id'),
    validatorMiddleware
]
const createProductValidator = [
    check('title')
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ min: 3 })
        .withMessage('Title must be at least 3 characters long')
        .isLength({ max: 100 })
        .withMessage('Title must be less than 32 characters long'),


    check('description')
        .notEmpty()
        .withMessage('description is required')
        .isLength({ min: 3 })
        .withMessage('description must be at least 3 characters long')
        .isLength({ max: 100 })
        .withMessage('description must be less than 32 characters long'),


    check('quantity')
        .notEmpty()
        .withMessage('quantity is required')
        .isNumeric()
        .withMessage('quantity must be a number'),



    check('sold')
        .optional()
        .isNumeric()
        .withMessage('quantity must be a number'),


    check('price')
        .notEmpty()
        .withMessage('price is required')
        .toFloat()
        .isNumeric()
        .withMessage('price must be a number')
        .isLength({ max: 100 })
        .withMessage('price must be less than 100'),


    check('priceDiscount')
        .optional()
        .isNumeric()
        .withMessage('price after discount must be a number')
        .toFloat()
        .custom((value, { req }) => {
            if (req.body.price <= value) {
                throw new Error('Price after discount must be lower than price')
            }
            return true
        })
    ,


    check('colors')
        .optional()
        .isArray()
        .withMessage('colors should be an array of colors'),


    check('image')
        .notEmpty()
        .withMessage('image is required'),


    check('galary')
        .optional()
        .isArray()
        .withMessage('colors should be an array of images'),


    check('rating')
        // .optional()
        .notEmpty()
        .withMessage('rating is required')
        .isNumeric()
        .withMessage('rating must be a number')
        .isLength({ min: 1, max: 5 })
        .withMessage('rating must be a numbesssss')
    // .toFloat()
    ,


    check('ratingQuantity')
        .optional()
        .isNumeric()
        .withMessage('rating_quantity quantity must be a number')
        .toFloat()
        .isLength({ min: 0 })
        .withMessage('rating_quantity quantity must be greater than 0'),

    check('category')
        .notEmpty()
        .withMessage('category is required')
        .isMongoId()
        .withMessage('Invalid Category id'),


    check('subcategory')
        .optional()
        .isMongoId()
        .withMessage('Invalid subcategory id'),

    check('brand')
        .optional()
        .isMongoId()
        .withMessage('Invalid brand id'),




    validatorMiddleware
]
const updateProductValidator = [
    check('id')
        .notEmpty()
        .withMessage('Product id is required')
        .isMongoId()
        .withMessage('Invalid Product id'),
    check('title')
        .notEmpty()
        .withMessage('title is required')
        .isLength({ min: 3 })
        .withMessage('title must be at least 3 characters long')
        .isLength({ max: 32 })
        .withMessage('title must be less than 32 characters long'),
    validatorMiddleware
]
const deleteProductValidator = [
    check('id')
        .notEmpty()
        .withMessage('Product id is required')
        .isMongoId()
        .withMessage('Invalid id'),
    validatorMiddleware
]

module.exports = {
    getProductValidator,
    createProductValidator,
    updateProductValidator,
    deleteProductValidator
}