const slugify = require('slugify');

const { check } = require('express-validator')
const validatorMiddleware = require('../../middleware/validatorMiddleware')
const User = require("../../models/user.model")


const signupValidator = [
    check('name')
        .notEmpty()
        .withMessage('name is required')
        .custom((value, { req }) => {
            if (value) {
                req.body.slug = slugify(value)
            }
            return true
        })
    ,
    check('username')
        .notEmpty()
        .withMessage('username is required')
        .isLength({ min: 3 })
        .withMessage('username must be at least 3 characters long')
        .isLength({ max: 32 })
        .withMessage('username must be less than 32 characters long')
        .custom(async (value) => {
            const user = await User.findOne({ username: value })
            if (user) {
                return Promise.reject(new Error('Username already exists'))
            }
            if (/\s/.test(value)) {
                return Promise.reject(new Error('username cannot contain spaces'))
            }
            return true
        })
    ,
    check('email')
        .notEmpty()
        .withMessage('email is required')
        .isEmail()
        .withMessage('Invalid email')
        .custom(async (email) => {
            const user = await User.findOne({ email })
            if (user) {
                return Promise.reject(new Error('Email already exists'))
            }
            return true
        })
    ,
    check('password')
        .notEmpty()
        .withMessage('password is required')
        .isLength({ min: 6 })
        .withMessage('password must be at least 6 characters long')
        .isLength({ max: 32 })
        .withMessage('password must be less than 32 characters long'),
    validatorMiddleware
]

const loginValidator = [
    check('username')
        .optional()
        .notEmpty()
        .withMessage('username is required')
        .isLength({ min: 3 })
        .withMessage('username must be at least 3 characters long')
        .isLength({ max: 32 })
        .withMessage('username must be less than 32 characters long')
        // .custom(async (value) => {
        //     const user = await User.findOne({ username: value })
        //     if (!user) {
        //         return Promise.reject(new Error('Username already exists'))
        //     }
        //     if (/\s/.test(value)) {
        //         return Promise.reject(new Error('username cannot contain spaces'))
        //     }
        //     return true
        // })
    ,
    check('email')
        .optional()
        .notEmpty()
        .withMessage('email is required')
        .isEmail()
        .withMessage('Invalid email')
        // .custom(async (email) => {
        //     const user = await User.findOne({ email })
        //     if (!user) {
        //         return Promise.reject(new Error('invalid email'));
        //     }
        //     return true
        // })
    ,
    check('password')
        .notEmpty()
        .withMessage('password is required')
        .isLength({ min: 6 })
        .withMessage('password must be at least 6 characters long')
        .isLength({ max: 32 })
        .withMessage('password must be less than 32 characters long'),
    validatorMiddleware
]


module.exports = {
    signupValidator,
    loginValidator
}