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


module.exports = {
    getAllCartValidator,
}