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
        .withMessage('Too long name'),
    validatorMiddleware
]
exports.updateCategoryValidator = [
    check('id')
        .isMongoId()
        .withMessage('Invalid category id'),
    validatorMiddleware
]
exports.deleteCategoryValidator = [
    check('id')
        .isMongoId()
        .withMessage('Invalid category id'),
    validatorMiddleware
]