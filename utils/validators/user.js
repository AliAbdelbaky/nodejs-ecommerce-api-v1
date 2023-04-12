const slugify = require('slugify');
// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require('bcryptjs')

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
        .withMessage('Invalid phone')
        .custom(async (phone) => {
            const user = await User.findOne({ phone })
            if (user) {
                return Promise.reject(new Error('Phone already exists'))
            }
            return true
        })
    ,
    check('image')
        .optional()
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
        .custom(async (value, { req }) => {
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

const updateUserPassword = [
    check('id')
        .notEmpty()
        .withMessage('User id is required')
        .isMongoId()
        .withMessage('Invalid User id'),
    check('currentPassword')
        .notEmpty()
        .withMessage('Current password is required')
    ,
    check('passwordConfirmation')
        .notEmpty()
        .withMessage('Password confirmation is required')
    ,
    check('password')
        .notEmpty()
        .withMessage('password is required')
        .custom(async (val, { req }) => {
            const user = await User.findOne({ _id: req.params.id })
            if (!user) {
                return Promise.reject(new Error('User not found'))
            }
            // invalid current password
            const isValid = await bcrypt.compare(req.body.currentPassword, user.password)
            if (!isValid) {
                return Promise.reject(new Error('Incorrect current password'))
            }
            // password !== current password
            if (val === req.body.currentPassword) {
                return Promise.reject(new Error('Password cannot be equal to current password'))
            }
            // password === confirmation password
            if (req.body.passwordConfirmation !== val) {
                return Promise.reject(new Error('Incorrect confirm password'))
            }
            return true
        })
        .isLength({ min: 6 })
        .withMessage('password must be at least 6 characters long')
        .isLength({ max: 32 })
        .withMessage('password must be less than 32 characters long')
    ,
    validatorMiddleware
]

module.exports = {
    getUserValidator,
    createUserValidator,
    updateUserValidator,
    deleteUserValidator,
    updateUserPassword
}