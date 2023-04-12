const slugify = require('slugify');

const { check } = require('express-validator')
const validatorMiddleware = require('../../middleware/validatorMiddleware')
const User = require("../../models/user.model")


const getUserValidator = [
    check('id')
        .notEmpty()
        .withMessage('User id is required')
        .isMongoId()
        .withMessage('Invalid User id'),
    validatorMiddleware
]
const createUserValidator = [
    check('username')
        .notEmpty()
        .withMessage('username is required')
        .isLength({ min: 3 })
        .withMessage('username must be at least 3 characters long')
        .isLength({ max: 32 })
        .withMessage('username must be less than 32 characters long')
        .custom((value, { req }) => {
            req.body.slug = slugify(value)
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
    check('role')
        .optional()
        .custom((val, { req }) => {
            if (!['user', 'admin'].includes(val.trim())) {
                return Promise.reject(new Error('Role value must be user or admin'))
            }
            return true
        }),
    check('phone')
        .optional()
        .notEmpty()
        .withMessage('phone is required')
        .isMobilePhone(['ar-EG', 'ar-SA'])
        .withMessage('Invalid phone'),
    check('image')
        .notEmpty()
        .withMessage('Image is required')
    ,
    validatorMiddleware
]
const updateUserValidator = [
    check('id')
        .notEmpty()
        .withMessage('User id is required')
        .isMongoId()
        .withMessage('Invalid User id'),
    check('username')
        .optional()
        .notEmpty()
        .withMessage('username is required')
        .isLength({ min: 3 })
        .withMessage('username must be at least 3 characters long')
        .isLength({ max: 32 })
        .withMessage('username must be less than 32 characters long')
        .custom((value, { req }) => {
            req.body.slug = slugify(value)
            return true
        })
    ,
    check('email')
        .optional()
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
        .optional()
        .notEmpty()
        .withMessage('password is required')
        .isLength({ min: 6 })
        .withMessage('password must be at least 6 characters long')
        .isLength({ max: 32 })
        .withMessage('password must be less than 32 characters long'),
    check('role')
        .optional()
        .custom((val, { req }) => {
            if (!['user', 'admin'].includes(val.trim)) {
                return Promise.reject(new Error('Role value must be user or admin'))
            }
            return true
        }),
    check('phone')
        .optional()
        .notEmpty()
        .withMessage('phone is required')
        .isMobilePhone(['ar-EG', 'ar-SA'])
        .withMessage('Invalid phone'),
    check('image')
        .optional()
        .notEmpty()
        .withMessage('Image is required')
        .isString()
        .withMessage('Image must be a string')
    ,
    validatorMiddleware
]
const deleteUserValidator = [
    check('id')
        .notEmpty()
        .withMessage('User id is required')
        .isMongoId()
        .withMessage('Invalid id'),
    validatorMiddleware
]

module.exports = {
    getUserValidator,
    createUserValidator,
    updateUserValidator,
    deleteUserValidator
}