const factory = require('../utils/handlersFactory')
const Review = require('../models/review.model');


// @desc    Get list of Reviews
// @route   GET /api/v1/reviews
// @access  Public
const getReviewsList = factory.getAll(Review)

// @desc    Get specific Review by id
// @route   GET /api/v1/reviews/:id
// @access  Public
const getReview = factory.getOne(Review)

// @desc    Create Review
// @route   POST  /api/v1/reviews
// @access  Private/Protect/user
const createReview = factory.createOne(Review)

// @desc    Update specific Review
// @route   PUT /api/v1/reviews/:id
// @access  Private/Protect/user
const updateReview = factory.updateOne(Review)

// @desc    Delete specific Review
// @route   DELETE /api/v1/reviews/:id
// @access  Private/Protect/user-admin-manager
const deleteReview = factory.deleteOne(Review)

module.exports = {
    getReview,
    getReviewsList,
    createReview,
    updateReview,
    deleteReview
}
