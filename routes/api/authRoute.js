const express = require('express')
const {
    signup,
    login
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


module.exports = router