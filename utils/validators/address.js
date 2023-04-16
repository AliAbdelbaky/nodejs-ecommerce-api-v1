const { check } = require('express-validator')
const validatorMiddleware = require('../../middleware/validatorMiddleware')
const { User } = require("../../models/user.model")


const addAddressValidator = [
    check('alias')
        .notEmpty()
        .withMessage('alias id is required')
        .isString()
        .withMessage('invalid alias')
        .isLength({ min: 3 })
        .withMessage('Too short alias')
        .isLength({ max: 20 })
        .withMessage('Too long alias')
        .custom(async (val, { req }) => {
            const user = await User.findOne({ _id: req.user._id, "addresses.alias": val.trim().toLowerCase() })
            if (user) {
                return Promise.reject(new Error('Address already exists'))
            }
            return true
        })
    ,
    check('details')
        .notEmpty()
        .withMessage('details id is required')
        .isString()
        .withMessage('invalid details')
        .isLength({ min: 3 })
        .withMessage('Too short details')
        .isLength({ max: 150 })
        .withMessage('Too long details'),
    check('city')
        .notEmpty()
        .withMessage('city id is required')
        .isString()
        .withMessage('invalid city')
        .isLength({ min: 3 })
        .withMessage('Too short city')
        .isLength({ max: 150 })
        .withMessage('Too long city'),
    check('phone')
        .notEmpty()
        .withMessage('phone is required')
        .isMobilePhone(['ar-EG', 'ar-SA'])
        .withMessage('Invalid phone'),
    check('postalCode')
        .notEmpty()
        .withMessage('postal code is required')
        .isPostalCode('any')
        .withMessage('Invalid postal code'),
    validatorMiddleware
]
const removeAddressValidator = [
    check('addressId')
        .notEmpty()
        .withMessage('address id is required')
        .isMongoId()
        .withMessage('Invalid address id'),
    validatorMiddleware
]


module.exports = {
    addAddressValidator,
    removeAddressValidator
}