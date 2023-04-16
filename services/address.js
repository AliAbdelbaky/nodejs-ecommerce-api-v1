const asyncHandler = require('express-async-handler');
const { User } = require('../models/user.model');
const ApiError = require('../utils/apiError');

// @desc    add address to user address list
// @route   POST  /api/v1/address
// @access  Private/user
const addAddress = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.user._id, {
        $addToSet: { addresses: req.body }
    }, { new: true })
    if (!user) {
        return next(new ApiError(`No document for this id ${req.params.id}`, 404))
    }
    res.status(200).json({
        data: user.addresses,
        message: 'Address added successfully'
    })

})
// @desc    delete address from address list
// @route   DELETE  /api/v1/address/:addressId
// @access  Private/user
const deleteAdress = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.user._id, {
        $pull: { addresses: { _id: req.params.addressId } }
    }, { new: true })
    if (!user) {
        return next(new ApiError(`No document for this id ${req.params.id}`, 404))
    }
    res.status(200).json({
        data: user.wishlist,
        message: 'Address removed successfully'
    })
})

// @desc    get all addresses at address list
// @route   GET  /api/v1/address
// @access  Private/user
const getAllAddresses = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id).populate('addresses')
    if (!user) {
        return next(new ApiError(`No document for this id ${req.params.id}`, 404))
    }
    res.status(200).json({
        results: user.addresses.length,
        data: user.addresses,
    })
})

// @desc    get specific addresse
// @route   GET  /api/v1/address/:addressId
// @access  Private/user
const getSpecificAddress = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ _id: req.user._id, 'addresses._id': req.params.addressId })
    if (!user) {
        return next(new ApiError(`No document for this id ${req.params.id}`, 404))
    }
    res.status(200).json({
        data: user.addresses.find((x) => x._id.toString() === req.params.addressId) || null,
    })
})




module.exports = {
    addAddress,
    deleteAdress,
    getAllAddresses,
    getSpecificAddress
}