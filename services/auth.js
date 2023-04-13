const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs')
// eslint-disable-next-line import/no-extraneous-dependencies
const JWT = require('jsonwebtoken');
const User = require('../models/user.model');
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


// @desc    Protect middleware methods to protect the routes 
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
    const user = await User.findById(decoded.userId).select('-__v')
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
    next()
})

module.exports = {
    signup,
    login,
    protect
}