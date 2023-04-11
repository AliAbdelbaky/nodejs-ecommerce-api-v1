const factory = require('../utils/handlersFactory')
const User = require('../models/user.model');


// @desc    Get list of user
// @route   GET /api/v1/user
// @access  Private
const getUsersList = factory.getAll(User)

// @desc    Get specific brand by id
// @route   GET /api/v1/user/:id
// @access  Private
const getUser = factory.getOne(User)

// @desc    Create brand
// @route   POST  /api/v1/user
// @access  Private
const createUser = factory.createOne(User)

// @desc    Update specific brand
// @route   PUT /api/v1/user/:id
// @access  Private
const updateUser = factory.updateOne(User)

// @desc    Delete specific brand
// @route   DELETE /api/v1/user/:id
// @access  Private
const deleteUser = factory.deleteOne(User)

module.exports = {
    getUsersList,
    getUser,
    createUser,
    updateUser,
    deleteUser
}
