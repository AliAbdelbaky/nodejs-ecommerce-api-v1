const express = require('express')
const {
    signup,
    login,
    forgotPassword,
    verifyOTP,
    resetPassword,
    protect
} = require('../../services/auth')
const {
    signupValidator,
    loginValidator
} = require("../../utils/validators/auth")



const router = express.Router()


router
    .route('/signup')
    .post(signupValidator, signup)
router
    .route('/login')
    .post(loginValidator, login)
router
    .route('/forgotPassword')
    .post(forgotPassword)
router
    .route('/verifyOtp')
    .post(verifyOTP)
router
    .route('/resetPassword')
    .put(protect, resetPassword)


module.exports = router