const asyncHandler = require('express-async-handler');
const factory = require('../utils/handlersFactory')
const { User } = require('../models/user.model');
const ApiError = require('../utils/apiError');

// @desc    add product to wishlist
// @route   POST  /api/v1/wishlist
// @access  Private/user
const addProductToWishlist = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.user._id, {
        $addToSet: { wishlist: req.body.productId }
    }, { new: true })
    if (!user) {
        return next(new ApiError(`No document for this id ${req.params.id}`, 404))
    }
    res.status(200).json({
        data: user.wishlist,
        message: 'Product added successfully to wishlist'
    })

})
// @desc    get all products at wishlist
// @route   DELETE  /api/v1/wishlist/:productId
// @access  Private/user
const deleteProductToWishlist = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.user._id, {
        $pull: { wishlist: req.params.productId }
    }, { new: true })
    if (!user) {
        return next(new ApiError(`No document for this id ${req.params.id}`, 404))
    }
    res.status(200).json({
        data: user.wishlist,
        message: 'Product removed successfully to wishlist'
    })
})

// @desc    get all products at wishlist
// @route   GET  /api/v1/wishlist
// @access  Private/user
const getAllWishlist = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id).populate('wishlist')
    if (!user) {
        return next(new ApiError(`No document for this id ${req.params.id}`, 404))
    }
    res.status(200).json({
        results: user.wishlist.length,
        data: user.wishlist,
    })
})




module.exports = {
    addProductToWishlist,
    getAllWishlist,
    deleteProductToWishlist
}