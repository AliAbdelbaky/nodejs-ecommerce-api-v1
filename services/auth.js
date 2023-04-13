const crypto = require('crypto');

const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs')
// eslint-disable-next-line import/no-extraneous-dependencies
const JWT = require('jsonwebtoken');
const { User, roles } = require('../models/user.model');
const ApiError = require('../utils/apiError')

const generateToken = (id) => {
    const token = JWT.sign({ userId: id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE_TIME
    })
    return token
}

// @desc    create user 
// @route   POST  /api/v1/auth/signup
// @access  Public
const signup = asyncHandler(async (req, res, next) => {
    // 1 create a new user
    const user = await User.create({
        name: req.body.name,
        slug: req.body.slug,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    });
    // 2 generate a new token JWT
    const token = generateToken(user._id)
    // 3 send the token to the client
    res.status(201).json({ token, user });
});


// @desc    login 
// @route   POST  /api/v1/auth/login
// @access  Public
const login = asyncHandler(async (req, res, next) => {


    // 1 check if password && email || username is valid 
    if (!req.body.email && !req.body.username) {
        next(new ApiError('Please provide an email or username', 400))
        return
    }
    // 2 check if password and email is valid and user is authorized
    const findObject = {}
    if (req.body.email) {
        findObject.email = req.body.email
    } else {
        findObject.username = req.body.username
    }

    const user = await User.findOne(findObject).select('-__v -passwordChangedAt')

    if (user && (await bcrypt.compare(req.body.password, user.password))) {
        // 3 generate the token
        const token = generateToken(user._id)
        // 4 send the token to the client
        res.status(200).json({ token, user });
    } else {
        res.status(401).json({ message: 'Invalid Credentials' });
    }


});


// @desc    middleware methods to protect the routes based on token
const protect = asyncHandler(async (req, res, next) => {
    // 1 check if token exists
    let token = req.headers.authorization
    if (!token || !token.startsWith(`${process.env.TOKEN_TYPE}`)) {
        return next(new ApiError('Not authorized to access this route', 401))
    }

    // 2 verify the token expiration date etc
    token = token.split(' ')[1]
    const decoded = JWT.verify(token, process.env.JWT_SECRET)

    if (!decoded) {
        return next(new ApiError('Invalid token', 401))
    }

    // 3 check if user is authorized
    const user = await User.findById(decoded.userId)
    if (!user) {
        return next(new ApiError('This user is unauthorized', 401))
    }

    // 4 check if user changed password after created token
    if (user.passwordChangedAt) {
        const passwordTimestamp = parseInt(user.passwordChangedAt.getTime() / 1000, 10)
        if (passwordTimestamp > decoded.iat) {
            return next(new ApiError('User recently changed his password', 401))
        }
    }
    // 5 set user to req
    req.user = user;
    next()
})

// @desc    middleware methods to protect the routes based on given roles
const allowedTo = (...args) => asyncHandler(async (req, res, next) => {
    // 1 access given args 
    const checkSubset = (parentArray, subsetArray) => subsetArray.every((el) => parentArray.includes(el))
    if (!checkSubset(roles, args)) {
        return next(new ApiError(`Invalid given roles: ${args} , available roles: ${roles}`, 400))
    }

    // 2 check if user has at least one role of given args
    if (!args.includes(req.user.role)) {
        return next(new ApiError('Access denied', 403))
    }
    next()
})


// @desc    Forgot password 
// @route   POST  /api/v1/auth/forgotPassword
// @access  Public
const forgotPassword = asyncHandler(async (req, res, next) => {
    // 1 get user by email
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        return next(new ApiError('User not found', 404))
    }
    // 2 generate random 6 digit password OTP and save it to DB
    const OTP = Math.floor(100000 + Math.random() * 900000).toString();
    const encryptedOPT = crypto.createHash('sha256').update(OTP).digest('hex')
    // saved hashed OTP to database
    user.passwordResetCode = encryptedOPT
    user.passwordResetExpires = Date.now() + 15 * 60 * 1000 // 15 minutes from now
    user.passwordResetVerfield = false
    user.save()
    // 3 Send OTP code to user via email
    // 2 check if user exists, Generate random 6 digit password OTP and save it to DB
    // 3 Send OTP code to user via email
})

module.exports = {
    signup,
    login,
    protect,
    allowedTo,
    forgotPassword
}