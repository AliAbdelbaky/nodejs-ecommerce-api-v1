const express = require('express')
const { protect, allowedTo } = require('../../services/auth')
const reviewRoute = require('./reviewRoute')

const {
    createProduct,
    getProductsList,
    getProduct,
    updateProduct,
    deleteProduct
} = require('../../services/product')
const {
    createProductValidator,
    getProductValidator,
    updateProductValidator,
    deleteProductValidator
} = require("../../utils/validators/product")
const { uploadMixImage, resizeImageHandler } = require('../../middleware/imageMiddleware')

const router = express.Router()
// Nested route 
//  POST list of reviews pased on product id
//  GET /api/v1/products/:productId/reviews
//  GET /api/v1/products/:productId/reviews/:reviewsId
router.use('/:productId/reviews', reviewRoute)

router
    .route('/')
    .get(getProductsList)
    .post(protect, allowedTo('user'), uploadMixImage('image', 'galary'), resizeImageHandler('product', 'many_single'), createProductValidator, createProduct)
router
    .route('/:id')
    .get(getProductValidator, getProduct)
    .put(protect, allowedTo('user'), updateProductValidator, updateProduct)
    .delete(protect, allowedTo('user'), deleteProductValidator, deleteProduct)


module.exports = router