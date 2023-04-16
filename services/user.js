const asyncHandler = require('express-async-handler');
// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require('bcryptjs')
const factory = require('../utils/handlersFactory')
const { User } = require('../models/user.model');

const ApiError = require('../utils/apiError');
const generateToken = require('../utils/tokenGenerator');

// @desc    Get list of user
// @route   GET /api/v1/user
// @access  Private/Admin
const getUsersList = factory.getAll(User)

// @desc    Get specific user by id
// @route   GET /api/v1/user/:id
// @access  Private/Admin
const getUser = factory.getOne(User)

// @desc    Create user
// @route   POST  /api/v1/user
// @access  Private/Admin
const createUser = factory.createOne(User)

// @desc    Update specific user
// @route   PUT /api/v1/user/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res, next) => {
    const { body } = req
    delete body.password
    const document = await User.findByIdAndUpdate({ _id: req.params.id }, body, { new: true })
    if (document === null) {
        return next(new ApiError(`No document for this id ${req.params.id}`, 404))
    }
    res.status(200).json({ data: document })
})

// @desc    Update specific user
// @route   PUT /api/v1/user/changePassword/:id
// @access  Private/Admin
const changeUserPassword = asyncHandler(async (req, res, next) => {
    const document = await User.findByIdAndUpdate({ _id: req.params.id },
        { password: await bcrypt.hash(req.body.password, 12), passwordChangedAt: Date.now() },
        { new: true }).select('-__v -passwordChangedAt')
    if (document === null) {
        next(new ApiError(`No document for this id ${req.params.id}`, 404))
        return
    }
    res.status(200).json({ data: document })
})


// @desc    Delete specific user
// @route   DELETE /api/v1/user/:id
// @access  Private/Admin
const deleteUser = factory.deleteOne(User)


// @desc    Get logged user 
// @route   GET /api/v1/user/me
// @access  Private/protect
const getLoggedUser = asyncHandler(async (req, res, next) => {
    req.params.id = req.user._id;
    next();
})
// @desc    Update user password
// @route   PUT /api/v1/user/me/updatePassword
// @access  Private/protect
const updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
    const document = await User.findByIdAndUpdate({ _id: req.user._id },
        {
            password: await bcrypt.hash(req.body.password, 12),
            passwordChangedAt: Date.now()
        },
        { new: true }).select('-__v -passwordChangedAt')
    if (document === null) {
        next(new ApiError(`No document for this id ${req.params.id}`, 404))
        return
    }
    const token = generateToken(document._id)
    res.status(200).json({ data: document, token })
    next();
})


// @desc    Update user password
// @route   PUT /api/v1/user/me/updateData
// @access  Private/protect
const updateLoggedUserData = asyncHandler(async (req, res, next) => {
    const { body } = req
    // delete forbidden fields from body
    delete body.password
    delete body.role
    delete body.active
    const document = await User.findByIdAndUpdate({ _id: req.user._id }, body, { new: true })
    if (document === null) {
        next(new ApiError(`No document for this id ${req.params.id}`, 404))
        return
    }
    res.status(200).json({ data: document })
})

// @desc     PUT active status for user
// @route    PUT /api/v1/me/deactivateAccount
// @access   Private/protect
const deactivateAccount = asyncHandler(async (req, res, next) => {
    const document = await User.findByIdAndUpdate({ _id: req.user._id }, { active: req.body.active }, { new: true })
    if (document === null) {
        next(new ApiError(`No document for this id ${req.params.id}`, 404))
        return
    }
    res.status(200).json({ data: document })
})

module.exports = {
    getUsersList,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    changeUserPassword,
    getLoggedUser,
    updateLoggedUserPassword,
    updateLoggedUserData,
    deactivateAccount
}
