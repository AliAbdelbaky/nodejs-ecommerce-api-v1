const express = require('express')

const { protect, allowedTo } = require('../../services/auth')


const {
    getReview,
    getReviewsList,
    createReview,
    updateReview,
    deleteReview
} = require('../../services/review')
const {
    createReviewsValidator,
    updateReviewsValidator,
    getReviewsValidator,
    deleteReviewsValidator,
    getListReviewsValidator
} = require("../../utils/validators/review")

const router = express.Router({ mergeParams: true })

router
    .route('/')
    .get(getListReviewsValidator, getReviewsList)
    .post(protect, allowedTo('user'), createReviewsValidator, createReview)
router
    .route('/:id')
    .get(getReviewsValidator, getReview)
    .put(protect, allowedTo('user'), updateReviewsValidator, updateReview)
    .delete(protect, allowedTo('user', 'admin', 'manager'), deleteReviewsValidator, deleteReview)


module.exports = router