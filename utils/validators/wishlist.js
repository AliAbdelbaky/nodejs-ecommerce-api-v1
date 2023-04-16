const { check } = require('express-validator')
const validatorMiddleware = require('../../middleware/validatorMiddleware')

const addProductValidator = [
    check('productId')
        .notEmpty()
        .withMessage('product id is required')
        .isMongoId()
        .withMessage('Invalid product id'),
    validatorMiddleware
]
const removeProductValidator = [
    check('productId')
        .notEmpty()
        .withMessage('product id is required')
        .isMongoId()
        .withMessage('Invalid product id'),
    validatorMiddleware
]

module.exports = {
    addProductValidator,
    removeProductValidator
}