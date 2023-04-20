const { check } = require('express-validator')
const validatorMiddleware = require('../../middleware/validatorMiddleware')

const getAllCartValidator = [
    check('user')
        .custom((val, { req }) => {
            if (req.user.role === 'user') {
                req.filterObj = { user: req.user._id }
                console.log(req.filterObj)
            }
            return true
        })
    ,
    validatorMiddleware
]
const getSingleOrderValidator = [
    check('id')
        .notEmpty()
        .withMessage('order id is required')
        .isMongoId()
        .withMessage('invalid order id'),
    validatorMiddleware
]
// const createOrder = [
//     check('shippingAddress')
//         .optional()
//         .notEmpty()
//         .withMessage('shipping address is required')
//         .custom((val) => {
//             const { details }
//         })
// ]


module.exports = {
    getAllCartValidator,
    getSingleOrderValidator
}