const { check } = require('express-validator')
const validatorMiddleware = require('../../middleware/validatorMiddleware')

const createCartValidator = [
    check('productId')
        .notEmpty()
        .withMessage('productId is required')
        .isMongoId()
        .withMessage('Invalid productId'),
    check('color')
        .notEmpty()
        .withMessage('color field is required')
    ,
    validatorMiddleware
]


module.exports = {
    createCartValidator,
}