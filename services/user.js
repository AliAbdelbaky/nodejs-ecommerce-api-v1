const asyncHandler = require('express-async-handler');
// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require('bcryptjs')
const factory = require('../utils/handlersFactory')
const { User } = require('../models/user.model');

const ApiError = require('../utils/apiError');


// @desc    Get list of user
// @route   GET /api/v1/user
// @access  Private
const getUsersList = factory.getAll(User)

// @desc    Get specific user by id
// @route   GET /api/v1/user/:id
// @access  Private
const getUser = factory.getOne(User)

// @desc    Create user
// @route   POST  /api/v1/user
// @access  Private
const createUser = factory.createOne(User)

// @desc    Update specific user
// @route   PUT /api/v1/user/:id
// @access  Private
const updateUser = asyncHandler(async (req, res, next) => {
    const { body } = req
    delete body.password
    const document = await User.findByIdAndUpdate({ _id: req.params.id }, body, { new: true })
    if (document === null) {
        next(new ApiError(`No document for this id ${req.params.id}`, 404))
        return
    }
    res.status(200).json({ data: document })
})

// @desc    Update specific user
// @route   PUT /api/v1/user/changePassword/:id
// @access  Private
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
// @access  Private
const deleteUser = factory.deleteOne(User)

module.exports = {
    getUsersList,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    changeUserPassword
}
