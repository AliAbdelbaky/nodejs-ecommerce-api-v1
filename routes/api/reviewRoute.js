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
    createReviewsValidator
} = require("../../utils/validators/review")

const router = express.Router()

router
    .route('/')
    .get(getReviewsList)
    .post(protect, allowedTo('user'), createReviewsValidator, createReview)
router
    .route('/:id')
    .get(getReview)
    .put(protect, allowedTo('user'), updateReview)
    .delete(protect, allowedTo('user', 'admin', 'manager'), deleteReview)


module.exports = router